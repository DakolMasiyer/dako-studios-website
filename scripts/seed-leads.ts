/**
 * Seed the Supabase `leads` table.
 *
 *   1. Imports the 86 cold prospects from content/outreach/outreach_tracker.csv
 *      as lead_kind = 'outreach'.
 *   2. Migrates any existing content/leads.json inbound submissions as
 *      lead_kind = 'inbound'.
 *
 * This script only touches the database — it sends NO email. Safe to run as soon
 * as a Supabase project is provisioned and the 0001_leads.sql migration is applied.
 *
 * Run:  pnpm seed:leads
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local (auto-loaded below).
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// --- tiny .env.local loader (avoids a dotenv dependency) ----------------------
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

// --- minimal CSV parser (handles quoted fields with embedded commas) ----------
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

function templateForIndustry(industry: string): 'A' | 'B' | 'C' {
  const i = industry.toLowerCase()
  if (/\b(fashion|apparel|boutique|clothing|wear)\b/.test(i)) return 'B'
  if (/\b(restaurant|venue|cafe|food|dining|eatery)\b/.test(i)) return 'C'
  return 'A'
}

async function seedOutreach() {
  const csvPath = path.join(process.cwd(), 'content/outreach/outreach_tracker.csv')
  if (!fs.existsSync(csvPath)) {
    console.warn('No outreach_tracker.csv found, skipping outreach seed.')
    return
  }
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'))
  const header = rows.shift() || []
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase())
  const idx = {
    company: col('Company'),
    industry: col('Industry'),
    description: col('Description'),
    email: col('Email'),
    source: col('Source'),
    address: col('Address/Location'),
    template: col('Template'),
    emailType: col('Email Type'),
    status: col('Status'),
    notes: col('Notes'),
  }

  const records = rows
    .filter((r) => (idx.email >= 0 ? r[idx.email]?.trim() : ''))
    .map((r) => {
      const industry = idx.industry >= 0 ? (r[idx.industry] || '').trim() : ''
      const rawTemplate = idx.template >= 0 ? (r[idx.template] || '').trim().toUpperCase() : ''
      const template = ['A', 'B', 'C'].includes(rawTemplate)
        ? (rawTemplate as 'A' | 'B' | 'C')
        : templateForIndustry(industry)
      return {
        lead_kind: 'outreach' as const,
        company: idx.company >= 0 ? (r[idx.company] || '').trim() : null,
        industry: industry || null,
        description: idx.description >= 0 ? (r[idx.description] || '').trim() : null,
        email: (r[idx.email] || '').trim(),
        source: idx.source >= 0 ? (r[idx.source] || '').trim() : null,
        address: idx.address >= 0 ? (r[idx.address] || '').trim() : null,
        template,
        email_type: idx.emailType >= 0 ? (r[idx.emailType] || '').trim() || null : null,
        status: idx.status >= 0 && (r[idx.status] || '').trim() ? (r[idx.status] || '').trim() : 'Not sent',
        notes: idx.notes >= 0 ? (r[idx.notes] || '').trim() || null : null,
      }
    })

  // Upsert on email so re-running the seed is idempotent (won't duplicate the 86).
  const { error, count } = await supabase
    .from('leads')
    .upsert(records, { onConflict: 'email', ignoreDuplicates: true, count: 'exact' })
  if (error) throw error
  console.log(`Outreach: processed ${records.length} rows (inserted ~${count ?? 'n/a'}).`)
}

async function seedInbound() {
  const jsonPath = path.join(process.cwd(), 'content/leads.json')
  if (!fs.existsSync(jsonPath)) return
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8') || '[]') as Array<{
    name: string; contactInfo: string; service: string; message: string; status: string; timestamp: string
  }>
  if (!raw.length) return
  const records = raw.map((l) => ({
    lead_kind: 'inbound' as const,
    name: l.name,
    contact_info: l.contactInfo,
    service: l.service,
    message: l.message,
    status: l.status || 'Identified',
    created_at: l.timestamp,
  }))
  const { error } = await supabase.from('leads').insert(records)
  if (error) {
    console.warn('Inbound migration skipped/partial (likely already migrated):', error.message)
    return
  }
  console.log(`Inbound: migrated ${records.length} contact-form lead(s).`)
}

async function main() {
  await seedOutreach()
  await seedInbound()
  console.log('Seed complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
