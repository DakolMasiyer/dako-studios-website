/**
 * Import the hand-researched 62-lead Labs sprint batch (real estate, law, healthcare,
 * hospitality, diaspora-facing businesses) from content/outreach/labs_sprint_leads.csv,
 * re-drafting each through the qualification engine (Gemini) rather than importing the
 * spreadsheet's pre-written copy verbatim — so every Labs lead, manual-batch or future
 * Firecrawl-sourced, goes through the same qualify-and-draft path.
 *
 * Contact quality varies: rows with Contact Type EMAIL/BOTH get `email` set (sendable
 * once approved); PHONE/LINKEDIN-only rows get `phone`/`contact_name` instead and no
 * `email` — naturally unsendable until a real email is found, but still visible in the CRM.
 *
 * Sends NO email. Only inserts rows with email_approved = false.
 * Run:  pnpm tsx scripts/import-labs-sprint.ts
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + GEMINI_API_KEY in .env.local.
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
// Dynamic import, loaded after loadEnvLocal() below — qualify.ts reads GEMINI_API_KEY
// at module-load time, so a static import here would resolve before .env.local loads.
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
if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env.local. Aborting.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// Same hand-rolled quoted-CSV parser as seed-leads.ts (no new dependency).
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else field += c
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field); field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some((f) => f.length)) rows.push(row)
      row = []
    } else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

async function main() {
  const { qualifyLead } = (await import('../src/utils/qualify')) as QualifyModule

  const csvPath = path.join(process.cwd(), 'content/outreach/labs_sprint_leads.csv')
  if (!fs.existsSync(csvPath)) {
    console.error(`Not found: ${csvPath}`)
    process.exit(1)
  }
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8')).filter(
    (r) => !/^total leads/i.test((r[0] || '').trim())
  )
  const header = rows.shift() || []
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase())
  const idx = {
    company: col('Company'),
    niche: col('Niche'),
    track: col('Track'),
    city: col('City'),
    website: col('Website'),
    websiteStatus: col('Website Status'),
    contactName: col('Contact Name'),
    contact: col('Contact'),
    contactType: col('Contact Type'),
    description: col('Description'),
    priority: col('Priority'),
    batchRun: col('Batch_Run'),
    coreProblem: col('Core Problem'),
  }

  let qualified = 0
  let lowPriority = 0
  let blockedNoEmail = 0
  let inserted = 0
  let failed = 0
  const samples: { company: string; status: string; reason: string; subject: string }[] = []

  for (const r of rows) {
    const company = (r[idx.company] || '').trim()
    if (!company) continue

    const niche = (r[idx.niche] || '').trim()
    const city = (r[idx.city] || '').trim()
    const websiteStatus = (r[idx.websiteStatus] || '').trim()
    const description = (r[idx.description] || '').trim()
    const coreProblem = (r[idx.coreProblem] || '').trim()
    const contactType = (r[idx.contactType] || '').trim().toUpperCase()
    const contact = (r[idx.contact] || '').trim()
    const contactName = (r[idx.contactName] || '').trim()
    const priorityRaw = (r[idx.priority] || '').trim().toUpperCase()
    const priority = ['HIGH', 'MEDIUM', 'LOW'].includes(priorityRaw) ? priorityRaw : null
    const batchRun = (r[idx.batchRun] || '').trim()

    const evidence = [
      `Website status: ${websiteStatus || 'unknown'}.`,
      description && `Research notes: ${description}`,
      coreProblem && `Diagnosed core problem: ${coreProblem}`,
    ].filter(Boolean).join(' ')

    let result
    try {
      result = await qualifyLead({ company, niche, arm: 'Labs', evidence })
    } catch (e) {
      failed++
      console.error(`  ✗ ${company}: qualifyLead failed — ${e instanceof Error ? e.message : String(e)}`)
      continue
    }

    if (result.qualification_status === 'Qualified') qualified++
    else if (result.qualification_status === 'Low priority') lowPriority++

    const hasEmail = contactType === 'EMAIL' || contactType === 'BOTH'
    const email = hasEmail && contact.includes('@') ? contact.toLowerCase() : null
    if (!email) blockedNoEmail++

    const phone = !hasEmail || contactType === 'BOTH'
      ? (contactType === 'LINKEDIN' ? null : (contact.includes('@') ? null : contact))
      : null

    const record = {
      lead_kind: 'outreach' as const,
      status: 'Not sent' as const,
      arm: 'Labs' as const,
      company,
      industry: niche || null,
      description: description || null,
      email,
      source: city || null,
      address: city || null,
      template: null,
      qualification_status: result.qualification_status,
      qualification_reason: result.qualification_reason,
      pain_point: result.pain_point,
      customized_email_subject: result.customized_email_subject || null,
      customized_email_body: result.customized_email_body || null,
      email_approved: false,
      phone: phone || null,
      contact_name: contactName && contactName !== '—' ? contactName : null,
      priority,
      batch_run: batchRun || null,
    }

    // No email = no unique-index conflict target; guard re-runs by company+batch_run instead.
    if (email) {
      const { error } = await supabase.from('leads').upsert(record, { onConflict: 'email', ignoreDuplicates: true })
      if (error) { failed++; console.error(`  ✗ ${company}: insert failed — ${error.message}`); continue }
    } else {
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('company', company)
        .eq('batch_run', batchRun || '')
        .limit(1)
      if (existing && existing.length) {
        console.log(`  · ${company}: already imported, skipping`)
        continue
      }
      const { error } = await supabase.from('leads').insert(record)
      if (error) { failed++; console.error(`  ✗ ${company}: insert failed — ${error.message}`); continue }
    }

    inserted++
    if (samples.length < 5) {
      samples.push({
        company,
        status: result.qualification_status,
        reason: result.qualification_reason,
        subject: result.customized_email_subject,
      })
    }
    console.log(`  ✓ ${company} — ${result.qualification_status}${email ? '' : ' (no email — blocked)'}`)
  }

  console.log('\n--- Import summary ---')
  console.log(`Processed: ${rows.length} rows`)
  console.log(`Inserted: ${inserted}`)
  console.log(`Qualified: ${qualified} | Low priority: ${lowPriority} | Failed: ${failed}`)
  console.log(`Blocked (no usable email): ${blockedNoEmail}`)
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
