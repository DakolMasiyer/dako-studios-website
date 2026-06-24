/**
 * Enrich + requalify a small, named subset of existing Motion leads with real
 * Firecrawl presence evidence (website + Instagram), then write the result to the
 * live `leads` table — same write path as requalify-motion.ts, but with richer,
 * inspected evidence instead of just category/industry text.
 *
 * Run:  pnpm tsx scripts/requalify-subset.ts
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

// Companies already confirmed (previous test run) to yield real website signal —
// avoids re-spending credits on the dead-end searches from that same test.
const SUBSET = [
  { company: 'Absolute Fragrance', website: 'https://www.directory.org.ng/absolute_fragrance', social: 'https://www.instagram.com/absolutefragrancesfm/' },
  { company: 'BluCabana Restaurant & Cafe', website: 'https://www.tripadvisor.com/Restaurant_Review-g293825-d5263094-Reviews-BluCabana_Restaurant_Cafe-Abuja_Federal_Capital_Territory.html', social: 'https://www.instagram.com/blucabanarestaurant/' },
  { company: 'La Mimz Concepts Limited', website: 'https://www.africa2trust.com/B2BAfrica/nigeria/retail/boutique/la-mimz-concepts-limited-la-mimz-beauty-store-ng/Profile/AboutUs/1/6/79499/3/?l=1&c=6&glx=1&sid=79499&CatID=3', social: 'https://www.instagram.com/mims_en/' },
  { company: 'Vinicksnatural Skincare Organics', website: 'https://connectciti.com/listing/vnkskincare', social: 'https://www.instagram.com/vnkskincare/' },
  { company: 'Essence De Beaute', website: 'https://bw.maptons.com/p/10179464478', social: 'https://www.instagram.com/essencedebeauteofficial/' },
]

async function getCredits(): Promise<number> {
  const res = await fetch(`${FIRECRAWL_BASE}/v1/team/credit-usage`, { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` } })
  const json = (await res.json()) as { data?: { remaining_credits?: number } }
  return json.data?.remaining_credits ?? -1
}

async function main() {
  const { inspectPresence } = await import('../src/utils/firecrawl')
  const { qualifyLead } = await import('../src/utils/qualify')

  const before = await getCredits()
  console.log(`Firecrawl credits before: ${before}\n`)

  for (const entry of SUBSET) {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, company, industry, address')
      .eq('lead_kind', 'outreach')
      .eq('arm', 'Motion')
      .eq('company', entry.company)
      .limit(1)
      .maybeSingle()
    if (error || !lead) {
      console.error(`  ✗ ${entry.company}: not found in DB — ${error?.message || 'no match'}`)
      continue
    }

    const signal = await inspectPresence(entry.website, entry.social)

    const evidence = [
      `Industry: ${lead.industry || 'unknown'}.`,
      `Location: ${lead.address || 'unknown'}.`,
      `Website inspected (${entry.website}): hasVideo=${signal.hasVideo}, hasContactForm=${signal.hasContactForm}, lastUpdatedHint=${signal.lastUpdatedHint || 'none'}.`,
      `Instagram inspected (${entry.social}): socialIsActive=${signal.socialIsActive}, hasReels=${signal.hasReels}.`,
      signal.sourcesAvailable.length ? `Sources successfully checked: ${signal.sourcesAvailable.join(', ')}.` : 'No sources could be successfully inspected.',
    ].join(' ')

    const result = await qualifyLead({ company: lead.company, niche: lead.industry || 'unknown', arm: 'Motion', evidence })

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
      console.error(`  ✗ ${lead.company}: update failed — ${updateError.message}`)
      continue
    }

    console.log(`  ✓ ${lead.company} — ${result.qualification_status}`)
    console.log(`    reason: ${result.qualification_reason}`)
    console.log(`    subject: ${result.customized_email_subject}\n`)
  }

  const after = await getCredits()
  console.log(`Firecrawl credits before: ${before} | after: ${after} | consumed: ${before - after}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
