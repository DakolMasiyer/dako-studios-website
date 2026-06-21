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

async function extract(urls: string[]): Promise<ProspectCandidate[]> {
  if (!urls.length) return []
  const res = await fetch(`${FIRECRAWL_BASE}/v1/extract`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      prompt:
        'Extract the business contact details. Return the company/brand name, the best public contact email (prefer hello@ or info@), a one-line description of what they sell, and their city/location if shown.',
      schema: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          email: { type: 'string' },
          description: { type: 'string' },
          address: { type: 'string' },
        },
      },
    }),
  })
  if (!res.ok) throw new Error(`Firecrawl extract failed: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { data?: ProspectCandidate | ProspectCandidate[] }
  const data = json.data
  if (!data) return []
  return Array.isArray(data) ? data : [data]
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
