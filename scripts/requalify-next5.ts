/**
 * Enrich + requalify the next 5 not-yet-enriched Motion leads: search for a website +
 * Instagram profile, inspect both for real presence signal, qualify with that evidence,
 * and write the result to the live `leads` table. Skips the 5 companies already done in
 * requalify-subset.ts.
 *
 * Run:  pnpm tsx scripts/requalify-next5.ts
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

const ALREADY_DONE = new Set([
  'Absolute Fragrance',
  'BluCabana Restaurant & Cafe',
  'La Mimz Concepts Limited',
  'Vinicksnatural Skincare Organics',
  'Essence De Beaute',
])

async function getCredits(): Promise<number> {
  const res = await fetch(`${FIRECRAWL_BASE}/v1/team/credit-usage`, { headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` } })
  const json = (await res.json()) as { data?: { remaining_credits?: number } }
  return json.data?.remaining_credits ?? -1
}

async function main() {
  const { requalifyLead } = await import('../src/utils/requalify')

  const before = await getCredits()
  console.log(`Firecrawl credits before: ${before}\n`)

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, company, industry, address')
    .eq('lead_kind', 'outreach')
    .eq('arm', 'Motion')
    .eq('qualification_status', 'Low priority')
    .order('id', { ascending: true })
    .limit(40)
  if (error) throw error

  const next5 = (leads || []).filter((l) => l.company && !ALREADY_DONE.has(l.company)).slice(0, 5)
  console.log(`Selected: ${next5.map((l) => l.company).join(', ')}\n`)

  for (const lead of next5) {
    const company = lead.company || 'Unknown'

    try {
      const result = await requalifyLead({
        id: lead.id,
        company,
        industry: lead.industry ?? undefined,
        address: lead.address ?? undefined,
        arm: 'Motion',
      })
      console.log(`  ✓ ${company} — ${result.qualificationStatus}`)
      console.log(`    website: ${result.websiteUrl || '(none)'}  social: ${result.socialUrl || '(none)'}`)
      console.log(`    reason: ${result.qualificationReason}\n`)
    } catch (e) {
      console.error(`  ✗ ${company}: requalify failed — ${e instanceof Error ? e.message : String(e)}`)
      continue
    }
  }

  const after = await getCredits()
  console.log(`Firecrawl credits before: ${before} | after: ${after} | consumed: ${before - after}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
