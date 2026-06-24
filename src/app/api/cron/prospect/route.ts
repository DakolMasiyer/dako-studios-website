import { NextResponse } from 'next/server'
import { getLeads, insertOutreachLeads, NewOutreachLead } from '@/utils/marketing-data'
import { sourceProspects, inspectPresence, isFirecrawlConfigured, ProspectCandidate } from '@/utils/firecrawl'
import { qualifyLead } from '@/utils/qualify'
import { isAuthorizedCron } from '@/utils/cron-auth'

/**
 * Loop A — prospecting. Daily cron. Sources one niche+source combo per arm, dedupes
 * against the existing pipeline, drops poor-fit prospects (rules from dako-cold.md /
 * labs-cold.md), runs each survivor through the qualification engine (Gemini), and
 * inserts the result as 'Not sent' — where a human reviews + Loop B picks them up.
 *
 * Sends no email. Safely no-ops when FIRECRAWL_API_KEY is unset, so it stays dormant
 * during the build-only phase.
 */

export const dynamic = 'force-dynamic'

type Arm = 'Motion' | 'Labs' | 'Brand' | 'Film' | 'Academy'
type Combo = { niche: string; source: string; industry: string }

// Rotated one-per-week by ISO week number. Motion arm: skincare/cosmetics/beverage/
// perfume/fashion/restaurant brands, Lagos/Abuja.
const MOTION_COMBOS: Combo[] = [
  { niche: 'skincare brands', source: 'Lagos', industry: 'Skincare' },
  { niche: 'cosmetics brands', source: 'Abuja', industry: 'Cosmetics' },
  { niche: 'beverage brands', source: 'Lagos', industry: 'Beverage' },
  { niche: 'perfume and fragrance brands', source: 'Lagos', industry: 'Perfume' },
  { niche: 'fashion boutiques', source: 'Lagos', industry: 'Fashion' },
  { niche: 'restaurants', source: 'Abuja', industry: 'Restaurant' },
]

// Labs arm: the 5 niches from src/app/labs/page.tsx, Lagos/Abuja.
const LABS_COMBOS: Combo[] = [
  { niche: 'real estate and property agencies', source: 'Lagos', industry: 'Real Estate & Property' },
  { niche: 'law firms and professional services', source: 'Abuja', industry: 'Law & Professional Services' },
  { niche: 'healthcare clinics', source: 'Lagos', industry: 'Healthcare & Clinics' },
  { niche: 'hospitality and restaurants', source: 'Abuja', industry: 'Hospitality & Restaurants' },
  { niche: 'diaspora and international services businesses', source: 'Lagos', industry: 'Diaspora & International Services' },
]

// DRAFT — first-pass niches, unreviewed (see arm-profiles.ts). Brand arm is scoped to the
// same verticals as Motion + Labs (cross-sell into an already-validated audience, not a
// separate prospecting universe — see content/outreach/brand-cold.md), so this combo list
// mirrors MOTION_COMBOS + LABS_COMBOS rather than defining its own niches.
const BRAND_COMBOS: Combo[] = [...MOTION_COMBOS, ...LABS_COMBOS]

// DRAFT — first-pass niches, unreviewed (see arm-profiles.ts). Film arm: events/
// hospitality/fashion brands with a visually rich space or product but no film, Lagos/Abuja.
const FILM_COMBOS: Combo[] = [
  { niche: 'event venues and event planners', source: 'Lagos', industry: 'Events & Venues' },
  { niche: 'boutique hotels and restaurants', source: 'Abuja', industry: 'Hospitality & Restaurants' },
  { niche: 'fashion and apparel brands', source: 'Lagos', industry: 'Fashion' },
]

// DRAFT — Academy is a training/education arm with prospective students, not businesses
// with an externally-observable gap. The niche+source+industry combo model assumes a
// business prospect; it does not map cleanly here. Left empty intentionally — see
// content/outreach/academy-cold.md and the report for the judgment call. Do not source
// against this arm until a human defines an actual audience + channel.
const ACADEMY_COMBOS: Combo[] = []

const DEAD_END_INBOXES = ['legal', 'careers', 'career', 'hr', 'pr', 'press', 'jobs', 'recruit', 'noreply', 'no-reply']
// Whole-word service-only disqualifiers (per dako-cold.md). Word-boundary matched.
// Motion-only: these exact business types (spas/clinics/law firms/agencies/realtors)
// are precisely who the Labs arm targets, so this filter must not apply there.
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

function describePresence(signal: Awaited<ReturnType<typeof inspectPresence>>): string {
  const yn = (v: boolean | null) => (v === null ? 'unknown' : v ? 'yes' : 'no')
  const website = signal.sourcesAvailable.includes('website')
    ? `Website: video found — ${yn(signal.hasVideo)}; contact form present — ${yn(signal.hasContactForm)}; last updated hint: ${signal.lastUpdatedHint || 'none detected'}.`
    : 'Website: not checked.'
  const social = signal.sourcesAvailable.includes('instagram')
    ? `Social: active posting — ${yn(signal.socialIsActive)}; Reels present — ${yn(signal.hasReels)}.`
    : 'Social: not checked.'
  return `${website} ${social}`
}

async function runCombo(
  arm: Arm,
  combo: Combo,
  existingEmails: Set<string>,
  existingDomains: Set<string>,
  seenThisRun: Set<string>
): Promise<{ kept: NewOutreachLead[]; dropped: { reason: string; company?: string; email?: string }[]; sourced: number }> {
  const dropped: { reason: string; company?: string; email?: string }[] = []
  const kept: NewOutreachLead[] = []

  let candidates: ProspectCandidate[]
  try {
    candidates = await sourceProspects(combo.niche, combo.source, 15)
  } catch (e) {
    dropped.push({ reason: `sourcing failed: ${e instanceof Error ? e.message : String(e)}` })
    return { kept, dropped, sourced: 0 }
  }

  for (const c of candidates) {
    const email = (c.email || '').trim().toLowerCase()
    const blurb = `${c.company || ''} ${c.description || ''}`

    if (!email || !email.includes('@')) { dropped.push({ reason: 'no email', company: c.company }); continue }
    if (existingEmails.has(email) || seenThisRun.has(email)) { dropped.push({ reason: 'duplicate email', email }); continue }
    if (existingDomains.has(domainOf(email))) { dropped.push({ reason: 'duplicate domain', email }); continue }
    if (DEAD_END_INBOXES.includes(localPartOf(email))) { dropped.push({ reason: 'dead-end inbox', email }); continue }
    if (arm === 'Motion' && isServiceOnly(blurb)) { dropped.push({ reason: 'service-only', company: c.company }); continue }

    seenThisRun.add(email)

    const signal = await inspectPresence(c.url, undefined)
    const evidence = describePresence(signal)

    try {
      const result = await qualifyLead({ company: c.company || '', niche: combo.niche, arm, evidence })
      kept.push({
        company: c.company,
        industry: combo.industry,
        description: c.description,
        email,
        source: c.source || combo.source,
        address: c.address,
        template: templateForIndustry(combo.industry),
        arm,
        qualificationStatus: result.qualification_status,
        qualificationReason: result.qualification_reason,
        painPoint: result.pain_point,
        customizedEmailSubject: result.customized_email_subject,
        customizedEmailBody: result.customized_email_body,
        emailApproved: false,
      })
    } catch (e) {
      dropped.push({ reason: `qualification failed: ${e instanceof Error ? e.message : String(e)}`, company: c.company, email })
      continue
    }
  }

  return { kept, dropped, sourced: candidates.length }
}

export async function POST(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isFirecrawlConfigured()) {
    return NextResponse.json({ note: 'Firecrawl not configured — prospecting idle.', inserted: 0 })
  }

  const ARM_BY_PARAM: Record<string, Arm> = {
    motion: 'Motion',
    labs: 'Labs',
    brand: 'Brand',
    film: 'Film',
    academy: 'Academy',
  }
  const COMBOS_BY_ARM: Record<Arm, Combo[]> = {
    Motion: MOTION_COMBOS,
    Labs: LABS_COMBOS,
    Brand: BRAND_COMBOS,
    Film: FILM_COMBOS,
    Academy: ACADEMY_COMBOS,
  }

  const { searchParams } = new URL(req.url)
  // Default stays 'motion' so existing scheduled/live behaviour is unaffected by the
  // 5-arm widening above.
  const armParam = (searchParams.get('arm') || 'motion').toLowerCase()
  const arms: Arm[] =
    armParam === 'all' ? (Object.values(ARM_BY_PARAM) as Arm[]) : [ARM_BY_PARAM[armParam] || 'Motion']

  const week = isoWeek(new Date())
  const combos: { arm: Arm; combo: Combo }[] = arms
    .map((arm) => {
      const list = COMBOS_BY_ARM[arm]
      return list.length ? { arm, combo: list[week % list.length] } : null
    })
    .filter((c): c is { arm: Arm; combo: Combo } => c !== null)

  // Dedupe set from existing pipeline (by email, then domain).
  const existing = await getLeads()
  const existingEmails = new Set(existing.map((l) => (l.email || '').toLowerCase()).filter(Boolean))
  const existingDomains = new Set(existing.map((l) => domainOf(l.email)).filter(Boolean))
  const seenThisRun = new Set<string>()

  const today = new Date().toISOString().slice(0, 10)
  const allKept: NewOutreachLead[] = []
  const allDropped: { reason: string; company?: string; email?: string }[] = []
  let totalSourced = 0

  for (const { arm, combo } of combos) {
    const { kept, dropped, sourced } = await runCombo(arm, combo, existingEmails, existingDomains, seenThisRun)
    totalSourced += sourced
    allDropped.push(...dropped)
    allKept.push(
      ...kept.map((lead) => ({
        ...lead,
        batchRun: `Sourced via Firecrawl • ${combo.niche} • ${combo.source} • ${today}`,
      }))
    )
  }

  const inserted = await insertOutreachLeads(allKept)

  return NextResponse.json({
    arm: armParam,
    combos,
    counts: { sourced: totalSourced, kept: allKept.length, inserted, dropped: allDropped.length },
    dropped: allDropped,
  })
}

export const GET = POST
