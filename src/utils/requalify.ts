import { inspectPresence, isUrlReachable } from './firecrawl'
import { qualifyLead } from './qualify'
import { updateLead } from './marketing-data'
import { Arm } from './arm-profiles'

/**
 * Shared enrichment step for Loop C (requalification): search for a website + Instagram
 * profile, inspect both for real presence signal, qualify with that evidence, and write
 * the result back to the lead. Used by both scripts/requalify-next5.ts (manual/ad hoc)
 * and /api/cron/requalify (scheduled) so the enrichment logic exists in exactly one place.
 */

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
const FIRECRAWL_BASE = process.env.FIRECRAWL_BASE_URL || 'https://api.firecrawl.dev'

async function searchFor(query: string, limit: number): Promise<{ url: string }[]> {
  if (!FIRECRAWL_API_KEY) return []
  const res = await fetch(`${FIRECRAWL_BASE}/v1/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit }),
  })
  if (!res.ok) return []
  const json = (await res.json()) as { data?: { url: string }[] }
  return json.data || []
}

const isProfileUrl = (url: string) =>
  /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?(\?.*)?$/i.test(url) &&
  !/\/(p|reel|reels|explore|accounts|stories)\//i.test(url)

export interface RequalifyLeadInput {
  id: string
  company: string
  industry?: string
  address?: string
  arm: Arm
}

export interface RequalifyLeadResult {
  websiteUrl?: string
  socialUrl?: string
  qualificationStatus: string
  qualificationReason: string
}

/**
 * Enrich one lead and write the requalification result back via updateLead(). Never sets
 * email_approved: true — requalification only refreshes the draft, a human still approves.
 */
export async function requalifyLead(lead: RequalifyLeadInput): Promise<RequalifyLeadResult> {
  const company = lead.company || 'Unknown'

  const websiteResults = await searchFor(
    `${company} ${lead.address || ''} official website -instagram -facebook`.trim(),
    5
  )
  const websiteUrl = websiteResults.find(
    (r) => r.url && !/instagram\.com|facebook\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com/i.test(r.url)
  )?.url

  const igResults = await searchFor(`site:instagram.com ${company}`, 5)
  const socialUrl = igResults.find((r) => r.url && isProfileUrl(r.url))?.url

  // Cheap reachability check before spending a Firecrawl scrape — a dead/unreachable
  // domain has only one possible finding ("couldn't reach it"), so skip the paid
  // AI-extraction call for it and fold that finding into the evidence directly.
  const websiteReachable = websiteUrl ? await isUrlReachable(websiteUrl) : false
  const socialReachable = socialUrl ? await isUrlReachable(socialUrl) : false

  const signal = await inspectPresence(
    websiteReachable ? websiteUrl : undefined,
    socialReachable ? socialUrl : undefined
  )

  const evidence = [
    `Industry: ${lead.industry || 'unknown'}.`,
    `Location: ${lead.address || 'unknown'}.`,
    !websiteUrl
      ? 'No website could be found.'
      : !websiteReachable
      ? `Website found at ${websiteUrl} but unreachable on a quick HTTP check (likely down) — treated as a strong staleness signal.`
      : `Website inspected (${websiteUrl}): hasVideo=${signal.hasVideo}, hasContactForm=${signal.hasContactForm}, lastUpdatedHint=${signal.lastUpdatedHint || 'none'}.`,
    !socialUrl
      ? 'No Instagram profile could be found.'
      : !socialReachable
      ? `Instagram profile found at ${socialUrl} but unreachable on a quick check.`
      : `Instagram inspected (${socialUrl}): socialIsActive=${signal.socialIsActive}, hasReels=${signal.hasReels}.`,
    signal.sourcesAvailable.length
      ? `Sources successfully checked: ${signal.sourcesAvailable.join(', ')}.`
      : 'No sources could be successfully inspected.',
  ].join(' ')

  const result = await qualifyLead({ company, niche: lead.industry || 'unknown', arm: lead.arm, evidence })

  await updateLead(lead.id, {
    qualification_status: result.qualification_status,
    qualification_reason: result.qualification_reason,
    pain_point: result.pain_point,
    customized_email_subject: result.customized_email_subject || undefined,
    customized_email_body: result.customized_email_body || undefined,
    email_approved: false,
  })

  return {
    websiteUrl,
    socialUrl,
    qualificationStatus: result.qualification_status,
    qualificationReason: result.qualification_reason,
  }
}
