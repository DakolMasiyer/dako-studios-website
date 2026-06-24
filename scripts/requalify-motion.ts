/**
 * One-off validation pass: run the qualification engine over the existing 86 Motion
 * outreach leads (originally just category-matched from outreach_tracker.csv, never
 * assessed for an actual gap). Populates qualification_status/reason/pain_point/drafted
 * email on each row WITHOUT touching status or sending anything — email_approved stays
 * false throughout. Proves the engine works and backfills the existing leads with the
 * richer data before Loop A starts doing this automatically on every future run.
 *
 * Run:  pnpm tsx scripts/requalify-motion.ts
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + GEMINI_API_KEY in .env.local.
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
type QualifyModule = typeof import('../src/utils/qualify')

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
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local. Aborting.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function main() {
  const { qualifyLead } = (await import('../src/utils/qualify')) as QualifyModule

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, company, industry, description, address')
    .eq('lead_kind', 'outreach')
    .eq('arm', 'Motion')
  if (error) throw error
  if (!leads || !leads.length) {
    console.log('No Motion outreach leads found.')
    return
  }

  console.log(`Requalifying ${leads.length} existing Motion leads...\n`)

  let qualified = 0
  let lowPriority = 0
  let failed = 0
  const samples: { company: string; status: string; reason: string; subject: string }[] = []

  for (const lead of leads) {
    const company = lead.company || 'Unknown company'
    const niche = lead.industry || 'unknown industry'
    const evidence = [
      `Industry: ${niche}.`,
      lead.description && `Research notes: ${lead.description}`,
      lead.address && `Location: ${lead.address}`,
    ].filter(Boolean).join(' ')

    let result
    try {
      result = await qualifyLead({ company, niche, arm: 'Motion', evidence })
    } catch (e) {
      failed++
      console.error(`  ✗ ${company}: ${e instanceof Error ? e.message : String(e)}`)
      continue
    }

    if (result.qualification_status === 'Qualified') qualified++
    else if (result.qualification_status === 'Low priority') lowPriority++

    const { error: updateError } = await supabase
      .from('leads')
      .update({
        qualification_status: result.qualification_status,
        qualification_reason: result.qualification_reason,
        pain_point: result.pain_point,
        customized_email_subject: result.customized_email_subject || null,
        customized_email_body: result.customized_email_body || null,
        email_approved: false,
        // status and send-related fields are deliberately untouched.
      })
      .eq('id', lead.id)
    if (updateError) {
      failed++
      console.error(`  ✗ ${company}: update failed — ${updateError.message}`)
      continue
    }

    console.log(`  ✓ ${company} — ${result.qualification_status}`)
    if (samples.length < 5) {
      samples.push({ company, status: result.qualification_status, reason: result.qualification_reason, subject: result.customized_email_subject })
    }
  }

  console.log('\n--- Requalification summary ---')
  console.log(`Processed: ${leads.length}`)
  console.log(`Qualified: ${qualified} | Low priority: ${lowPriority} | Failed: ${failed}`)
  console.log('\nSample drafts:')
  for (const s of samples) {
    console.log(`\n  ${s.company} [${s.status}]`)
    console.log(`  Reason: ${s.reason}`)
    console.log(`  Subject: ${s.subject}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
