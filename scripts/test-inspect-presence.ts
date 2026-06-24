/**
 * One-off measurement: run inspectPresence on a small batch of existing Motion leads
 * (which have no stored website/social URL — search first to find one, then inspect)
 * and report exact Firecrawl credit cost via the team credit-usage endpoint, so we can
 * extrapolate before running this against all 86.
 *
 * Read-only against Supabase — does not write qualification data anywhere.
 * Run:  pnpm tsx scripts/test-inspect-presence.ts
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

async function getCredits(): Promise<number> {
  const res = await fetch(`${FIRECRAWL_BASE}/v1/team/credit-usage`, {
    headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` },
  })
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

async function main() {
  const { inspectPresence } = await import('../src/utils/firecrawl')

  const before = await getCredits()
  console.log(`Credits before: ${before}`)

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, company, address, industry')
    .eq('lead_kind', 'outreach')
    .eq('arm', 'Motion')
    .limit(10)
  if (error) throw error
  if (!leads || !leads.length) {
    console.log('No Motion leads found.')
    return
  }

  console.log(`\nTesting inspectPresence on ${leads.length} leads...\n`)

  let searchCalls = 0
  let extractCalls = 0

  // Instagram *profile* URLs only — excludes deep links to a single post/reel, which
  // extractPresence can't infer "is this account active" from.
  const isProfileUrl = (url: string) =>
    /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?(\?.*)?$/i.test(url) &&
    !/\/(p|reel|reels|explore|accounts|stories)\//i.test(url)

  for (const lead of leads) {
    const company = lead.company || 'Unknown'

    const websiteResults = await searchFor(
      `${company} ${lead.address || ''} official website -instagram -facebook`.trim(),
      5
    )
    searchCalls++
    const websiteUrl = websiteResults.find(
      (r) => r.url && !/instagram\.com|facebook\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com/i.test(r.url)
    )?.url

    const igResults = await searchFor(`site:instagram.com ${company}`, 5)
    searchCalls++
    const socialUrl = igResults.find((r) => r.url && isProfileUrl(r.url))?.url

    if (websiteUrl) extractCalls++
    if (socialUrl) extractCalls++

    const signal = await inspectPresence(websiteUrl, socialUrl)

    console.log(`  ${company}`)
    console.log(`    website: ${websiteUrl || '(none found)'}`)
    console.log(`    social:  ${socialUrl || '(none found)'}`)
    console.log(`    signal:  ${JSON.stringify(signal)}\n`)
  }

  const after = await getCredits()
  console.log('--- Credit usage ---')
  console.log(`Search calls: ${searchCalls} | Extract calls attempted: ${extractCalls}`)
  console.log(`Credits before: ${before} | after: ${after} | consumed: ${before - after}`)
  console.log(`Per-lead average: ${((before - after) / leads.length).toFixed(2)} credits`)
  console.log(`Extrapolated for remaining ~76 leads: ~${(((before - after) / leads.length) * 76).toFixed(0)} credits`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
