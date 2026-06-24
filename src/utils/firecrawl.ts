/**
 * Firecrawl sourcing for Loop A (prospecting). Uses the Firecrawl HTTP API (not the
 * MCP, which isn't available in a Vercel cron) to search for SMB prospects in a
 * niche + source combo and extract company / email / description.
 *
 * NOTE: this is the sourcing primitive only. The /api/cron/prospect route applies
 * dedupe + clean-for-fit + template assignment on top. Verify against a live
 * Firecrawl key before relying on it; nothing here runs during the build-only phase.
 */

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
const FIRECRAWL_BASE = process.env.FIRECRAWL_BASE_URL || 'https://api.firecrawl.dev'

export function isFirecrawlConfigured(): boolean {
  return Boolean(FIRECRAWL_API_KEY)
}

export interface ProspectCandidate {
  company?: string
  email?: string
  description?: string
  address?: string
  source?: string
  url?: string
}

interface SearchResult {
  url: string
  title?: string
  description?: string
}

async function search(query: string, limit: number): Promise<SearchResult[]> {
  const res = await fetch(`${FIRECRAWL_BASE}/v1/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit }),
  })
  if (!res.ok) throw new Error(`Firecrawl search failed: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { data?: SearchResult[] }
  return json.data || []
}

/**
 * `/v1/extract` is deprecated and now async (returns a job id, not data) — this calls
 * the recommended replacement, `/v2/scrape` with a `json` format object, which is
 * synchronous and returns the extraction directly under `data.json`. One URL per call;
 * returns null on any failure (unreachable site, unsupported domain, etc.) rather than
 * throwing, so callers can degrade gracefully across a batch.
 */
async function scrapeJson<T>(url: string, prompt: string, schema: object): Promise<T | null> {
  const res = await fetch(`${FIRECRAWL_BASE}/v2/scrape`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: [{ type: 'json', prompt, schema }],
    }),
  })
  if (!res.ok) return null
  const json = (await res.json()) as { data?: { json?: T } }
  return json.data?.json ?? null
}

async function extract(urls: string[]): Promise<ProspectCandidate[]> {
  if (!urls.length) return []
  const prompt =
    'Extract the business contact details. Return the company/brand name, the best public contact email (prefer hello@ or info@), a one-line description of what they sell, and their city/location if shown.'
  const schema = {
    type: 'object',
    properties: {
      company: { type: 'string' },
      email: { type: 'string' },
      description: { type: 'string' },
      address: { type: 'string' },
    },
  }
  const results = await Promise.all(urls.map((url) => scrapeJson<ProspectCandidate>(url, prompt, schema)))
  const candidates: ProspectCandidate[] = []
  results.forEach((data, i) => {
    if (data) candidates.push({ ...data, url: urls[i] })
  })
  return candidates
}

/**
 * Source up to `limit` candidates for one niche + source combo, e.g.
 * sourceProspects('skincare brands', 'Lagos Instagram', 15).
 */
export async function sourceProspects(niche: string, source: string, limit = 15): Promise<ProspectCandidate[]> {
  if (!isFirecrawlConfigured()) {
    throw new Error('Firecrawl not configured. Set FIRECRAWL_API_KEY.')
  }
  const results = await search(`${niche} ${source} contact email`, limit)
  const urls = results.map((r) => r.url).filter(Boolean).slice(0, limit)
  const extracted = await extract(urls)
  return extracted.map((c, i) => ({ ...c, source, url: c.url || urls[i] }))
}

/**
 * Plain HTTP reachability check — no Firecrawl credits spent. Used to skip the costly
 * AI-extraction scrape (extractPresence) on domains that are simply down, so Loop C
 * doesn't pay for a scrape whose only possible finding is "couldn't reach it".
 */
export async function isUrlReachable(url: string, timeoutMs = 5000): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

export interface PresenceSignal {
  hasVideo: boolean | null
  hasContactForm: boolean | null
  socialIsActive: boolean | null
  hasReels: boolean | null
  lastUpdatedHint: string | null
  sourcesAvailable: string[]
}

interface PresenceExtraction {
  hasVideo?: boolean | null
  hasContactForm?: boolean | null
  socialIsActive?: boolean | null
  hasReels?: boolean | null
  lastUpdatedHint?: string | null
}

async function extractPresence(url: string): Promise<PresenceExtraction | null> {
  return scrapeJson<PresenceExtraction>(
    url,
    'Inspect this page for: (1) video content or embeds anywhere on it (hasVideo), (2) a working contact or booking form (hasContactForm), (3) signs of active social posting such as a linked feed with recent activity vs. a static grid (socialIsActive), (4) Reels/short-form video specifically as opposed to only static posts (hasReels), and (5) any staleness hint — an old copyright year, dead promos, broken layout, or anything suggesting the page is unmaintained (lastUpdatedHint, free text, or null if nothing stands out). Be honest — if you cannot tell, use null rather than guessing.',
    {
      type: 'object',
      properties: {
        hasVideo: { type: 'boolean' },
        hasContactForm: { type: 'boolean' },
        socialIsActive: { type: 'boolean' },
        hasReels: { type: 'boolean' },
        lastUpdatedHint: { type: 'string' },
      },
    }
  )
}

/**
 * Arm-agnostic raw signal collection for a candidate's web/social presence — the arm
 * profile interprets these signals, this just observes. Degrades gracefully: a missing
 * URL or a failed fetch yields null fields rather than throwing, so one bad URL in a
 * batch sourcing loop doesn't kill the run.
 */
export async function inspectPresence(websiteUrl?: string, socialUrl?: string): Promise<PresenceSignal> {
  const signal: PresenceSignal = {
    hasVideo: null,
    hasContactForm: null,
    socialIsActive: null,
    hasReels: null,
    lastUpdatedHint: null,
    sourcesAvailable: [],
  }

  if (websiteUrl && isFirecrawlConfigured()) {
    try {
      const site = await extractPresence(websiteUrl)
      if (site) {
        signal.hasVideo = site.hasVideo ?? null
        signal.hasContactForm = site.hasContactForm ?? null
        signal.lastUpdatedHint = site.lastUpdatedHint ?? null
        signal.sourcesAvailable.push('website')
      }
    } catch {
      /* degrade gracefully — leave website fields null */
    }
  }

  if (socialUrl && isFirecrawlConfigured()) {
    try {
      const social = await extractPresence(socialUrl)
      if (social) {
        signal.socialIsActive = social.socialIsActive ?? null
        signal.hasReels = social.hasReels ?? null
        signal.sourcesAvailable.push('instagram')
      }
    } catch {
      /* degrade gracefully — leave social fields null */
    }
  }

  return signal
}
