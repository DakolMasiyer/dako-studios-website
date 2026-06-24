/**
 * Enrich + requalify the next N not-yet-enriched Motion leads: search for a website +
 * Instagram profile, inspect both for real presence signal, qualify with that evidence,
 * and write the result to the live `leads` table. Skips companies already enriched in
 * prior batches (tracked in ALREADY_DONE, since some land back on "Low priority" with
 * real evidence and would otherwise be re-selected and re-billed every run).
 *
 * Run:  pnpm tsx scripts/requalify-batch.ts <count>
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}
loadEnvLocal()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
const FIRECRAWL_BASE = process.env.FIRECRAWL_BASE_URL || 'https://api.firecrawl.dev'
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !FIRECRAWL_API_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / FIRECRAWL_API_KEY in .env.local. Aborting.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const BATCH_SIZE = Number(process.argv[2]) || 5

// Companies already enriched with real search + inspectPresence evidence in prior
// batches (requalify-subset.ts, requalify-next5.ts, requalify-next2.ts). Several of
// these landed back on "Low priority" honestly (null signal), so a plain status filter
// alone would re-select and re-bill them every run.
const ALREADY_DONE = new Set([
  'Absolute Fragrance',
  'BluCabana Restaurant & Cafe',
  'La Mimz Concepts Limited',
  'Vinicksnatural Skincare Organics',
  'Essence De Beaute',
  "D'Scentsation",
  'Skinsational Skincare',
  'Acorns N Gold Boutiques',
  'Amelia-Couture',
  'Go-Natural Shea Butter',
  'Dark Chocolate Cosmetics',
  'TopKlass Cosmetics',
  'Sensiq Boutique',
])

async function getCredits(): Promise<number> {
  const res = await fetch(`${FIRECRAWL_BASE}/v1/team/credit-usage`, { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` } })
  const json = (await res.json()) as { data?: { remaining_credits?: number } }
  return json.data?.remaining_credits ?? -1
}

async function searchFor(query: string, limit: number): Promise<{ url: string }[]> {
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

async function main() {
  const { inspectPresence } = await import('../src/utils/firecrawl')
  const { qualifyLead } = await import('../src/utils/qualify')

  const before = await getCredits()
  console.log(`Firecrawl credits before: ${before}\n`)
  if (before <= 0) {
    console.error('Firecrawl balance is 0 — aborting before spending anything.')
    process.exit(1)
  }

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, company, industry, address')
    .eq('lead_kind', 'outreach')
    .eq('arm', 'Motion')
    .eq('qualification_status', 'Low priority')
    .order('id', { ascending: true })
    .limit(120)
  if (error) throw error

  const batch = (leads || []).filter((l) => l.company && !ALREADY_DONE.has(l.company)).slice(0, BATCH_SIZE)
  console.log(`Selected (${batch.length}): ${batch.map((l) => l.company).join(', ')}\n`)

  let qualified = 0
  let lowPriority = 0
  let failed = 0

  for (const lead of batch) {
    const company = lead.company || 'Unknown'
    try {
      const websiteResults = await searchFor(
        `${company} ${lead.address || ''} official website -instagram -facebook`.trim(),
        5
      )
      const websiteUrl = websiteResults.find(
        (r) => r.url && !/instagram\.com|facebook\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com/i.test(r.url)
      )?.url

      const igResults = await searchFor(`site:instagram.com ${company}`, 5)
      const socialUrl = igResults.find((r) => r.url && isProfileUrl(r.url))?.url

      const signal = await inspectPresence(websiteUrl, socialUrl)

      const evidence = [
        `Industry: ${lead.industry || 'unknown'}.`,
        `Location: ${lead.address || 'unknown'}.`,
        websiteUrl
          ? `Website inspected (${websiteUrl}): hasVideo=${signal.hasVideo}, hasContactForm=${signal.hasContactForm}, lastUpdatedHint=${signal.lastUpdatedHint || 'none'}.`
          : 'No website could be found.',
        socialUrl
          ? `Instagram inspected (${socialUrl}): socialIsActive=${signal.socialIsActive}, hasReels=${signal.hasReels}.`
          : 'No Instagram profile could be found.',
        signal.sourcesAvailable.length ? `Sources successfully checked: ${signal.sourcesAvailable.join(', ')}.` : 'No sources could be successfully inspected.',
      ].join(' ')

      const result = await qualifyLead({ company, niche: lead.industry || 'unknown', arm: 'Motion', evidence })

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          qualification_status: result.qualification_status,
          qualification_reason: result.qualification_reason,
          pain_point: result.pain_point,
          customized_email_subject: result.customized_email_subject || null,
          customized_email_body: result.customized_email_body || null,
          email_approved: false,
        })
        .eq('id', lead.id)
      if (updateError) {
        console.error(`  ✗ ${company}: update failed — ${updateError.message}`)
        failed++
        continue
      }

      if (result.qualification_status === 'Qualified') qualified++
      else if (result.qualification_status === 'Low priority') lowPriority++

      console.log(`  ✓ ${company} — ${result.qualification_status}`)
      console.log(`    website: ${websiteUrl || '(none)'}  social: ${socialUrl || '(none)'}`)
      console.log(`    reason: ${result.qualification_reason}\n`)
    } catch (e) {
      console.error(`  ✗ ${company}: ${e instanceof Error ? e.message : String(e)}\n`)
      failed++
    }
  }

  const after = await getCredits()
  console.log(`Summary: ${qualified} Qualified, ${lowPriority} Low priority, ${failed} failed`)
  console.log(`Firecrawl credits before: ${before} | after: ${after} | consumed: ${before - after}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
