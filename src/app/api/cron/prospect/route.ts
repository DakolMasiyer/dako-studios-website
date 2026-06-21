import { NextResponse } from 'next/server'
import { getLeads, insertOutreachLeads, NewOutreachLead } from '@/utils/marketing-data'
import { sourceProspects, isFirecrawlConfigured, ProspectCandidate } from '@/utils/firecrawl'
import { isAuthorizedCron } from '@/utils/cron-auth'

/**
 * Loop A — prospecting. Weekly cron. Sources one niche+source combo, dedupes against
 * the existing pipeline, drops poor-fit prospects (rules from dako-cold.md), assigns
 * a template, and inserts the survivors as 'Not sent' — where Loop B picks them up.
 *
 * Sends no email. Safely no-ops when FIRECRAWL_API_KEY is unset, so it stays dormant
 * during the build-only phase.
 */

export const dynamic = 'force-dynamic'

// Rotated one-per-week by ISO week number.
const COMBOS: { niche: string; source: string; industry: string }[] = [
  { niche: 'skincare brands', source: 'Lagos', industry: 'Skincare' },
  { niche: 'cosmetics brands', source: 'Abuja', industry: 'Cosmetics' },
  { niche: 'beverage brands', source: 'Lagos', industry: 'Beverage' },
  { niche: 'perfume and fragrance brands', source: 'Lagos', industry: 'Perfume' },
  { niche: 'fashion boutiques', source: 'Lagos', industry: 'Fashion' },
  { niche: 'restaurants', source: 'Abuja', industry: 'Restaurant' },
]

const DEAD_END_INBOXES = ['legal', 'careers', 'career', 'hr', 'pr', 'press', 'jobs', 'recruit', 'noreply', 'no-reply']
// Whole-word service-only disqualifiers (per dako-cold.md). Word-boundary matched.
const SERVICE_ONLY = ['spa', 'salon', 'clinic', 'hospital', 'dentist', 'lawyer', 'law firm', 'consulting', 'agency', 'realtor']

function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  return 1 + Math.round((date.getTime() - firstThursday.getTime()) / 604_800_000)
}

function domainOf(email?: string): string {
  return (email || '').split('@')[1]?.toLowerCase() || ''
}

function localPartOf(email?: string): string {
  return (email || '').split('@')[0]?.toLowerCase() || ''
}

function templateForIndustry(industry: string): 'A' | 'B' | 'C' {
  const i = industry.toLowerCase()
  if (/\b(fashion|apparel|boutique|clothing|wear)\b/.test(i)) return 'B'
  if (/\b(restaurant|venue|cafe|food|dining|eatery)\b/.test(i)) return 'C'
  return 'A'
}

function isServiceOnly(text: string): boolean {
  const hay = ` ${text.toLowerCase()} `
  return SERVICE_ONLY.some((w) => new RegExp(`\\b${w.replace(/ /g, '\\s')}\\b`).test(hay))
}

export async function POST(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isFirecrawlConfigured()) {
    return NextResponse.json({ note: 'Firecrawl not configured — prospecting idle.', inserted: 0 })
  }

  const combo = COMBOS[isoWeek(new Date()) % COMBOS.length]

  let candidates: ProspectCandidate[]
  try {
    candidates = await sourceProspects(combo.niche, combo.source, 15)
  } catch (e) {
    return NextResponse.json(
      { error: 'Sourcing failed', message: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    )
  }

  // Dedupe set from existing pipeline (by email, then domain).
  const existing = await getLeads()
  const existingEmails = new Set(existing.map((l) => (l.email || '').toLowerCase()).filter(Boolean))
  const existingDomains = new Set(existing.map((l) => domainOf(l.email)).filter(Boolean))

  const seenThisRun = new Set<string>()
  const kept: NewOutreachLead[] = []
  const dropped: { reason: string; company?: string; email?: string }[] = []

  for (const c of candidates) {
    const email = (c.email || '').trim().toLowerCase()
    const blurb = `${c.company || ''} ${c.description || ''}`

    if (!email || !email.includes('@')) { dropped.push({ reason: 'no email', company: c.company }); continue }
    if (existingEmails.has(email) || seenThisRun.has(email)) { dropped.push({ reason: 'duplicate email', email }); continue }
    if (existingDomains.has(domainOf(email))) { dropped.push({ reason: 'duplicate domain', email }); continue }
    if (DEAD_END_INBOXES.includes(localPartOf(email))) { dropped.push({ reason: 'dead-end inbox', email }); continue }
    if (isServiceOnly(blurb)) { dropped.push({ reason: 'service-only', company: c.company }); continue }

    seenThisRun.add(email)
    kept.push({
      company: c.company,
      industry: combo.industry,
      description: c.description,
      email,
      source: c.source || combo.source,
      address: c.address,
      template: templateForIndustry(combo.industry),
    })
  }

  const inserted = await insertOutreachLeads(kept)

  return NextResponse.json({
    combo,
    counts: { sourced: candidates.length, kept: kept.length, inserted, dropped: dropped.length },
    dropped,
  })
}

export const GET = POST
