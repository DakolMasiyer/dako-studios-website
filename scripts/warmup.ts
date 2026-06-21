/**
 * Domain warm-up sender for outreach@mail.dako.studio.
 *
 * mail.dako.studio is a brand-new Resend sending subdomain with no reputation.
 * Before any cold outreach, we warm it: small, varied, human-looking emails to a set
 * of friendly inboxes, a few times a day, for ~1–2 weeks.
 *
 *   Run:  pnpm warmup        (auto-loads RESEND_API_KEY + OUTREACH_FROM from .env.local)
 *
 * IMPORTANT — the script only SENDS. The actual warming comes from ENGAGEMENT:
 *   • open the emails, reply to a few
 *   • if any land in Spam, mark them "Not spam" / move to inbox
 *   • star / mark important
 * Do that each run. Run 2–3×/day, ramping gradually. Only after ~1–2 weeks should you
 * start real cold outreach — and start it at low volume.
 *
 * This deliberately BYPASSES OUTREACH_DRY_RUN (warm-up is a real send by design), so it
 * does not use the gated sendOutreachEmail().
 */
import fs from 'fs'
import path from 'path'

// --- tiny .env.local loader (same pattern as seed-leads.ts / test-gmail.ts) ----
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}
loadEnvLocal()

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.OUTREACH_FROM || 'Dakol <outreach@mail.dako.studio>'

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY missing (set it in .env.local). Aborting.')
  process.exit(1)
}

// Warming list (deduplicated). Keep these to inboxes you control / friendly contacts.
const RECIPIENTS = [
  'maxidakol@gmail.com',
  'hello@dakolmasiyer.com',
  'contact@nativesfilmworks.com',
  'info.nativesfilmworks@gmail.com',
  'mdakoljobs@gmail.com',
  'devdakol9@gmail.com',
  'aplusfilmlogistics@gmail.com',
  'dmasiyer@gmail.com',
  'dostsguas@gmail.com',
  'dakonconcepts@gmail.com',
  'dakol.masiyer@stu.cu.edu.ng',
  'firstfeatureswx@gmail.com',
]

// Varied, ordinary, non-templatey subject/body pairs — mundane everyday phrasing,
// avoids anything that reads as marketing/bulk.
const MESSAGES = [
  { subject: 'Quick one', body: `Hey,\n\nJust testing something on my end, ignore this one.\n\nTalk soon,\nDakol` },
  { subject: 'Checking something', body: `Hi,\n\nSending this to check a setup is working properly. Nothing needed from you.\n\nCheers,\nDakol` },
  { subject: 'Re: earlier chat', body: `Hey,\n\nFollowing up on something from earlier — will call properly later this week.\n\nSpeak soon,\nDakol` },
  { subject: 'For later', body: `Hi,\n\nNoting this down here so I don't forget. Will circle back on it properly.\n\nBest,\nDakol` },
  { subject: 'Test message', body: `Hey,\n\nThis is just a test message from a new setup — feel free to ignore.\n\nThanks,\nDakol` },
  { subject: 'Heads up', body: `Hi,\n\nSmall heads up on something I'm sorting out. Nothing urgent.\n\nTalk later,\nDakol` },
  { subject: 'One thing', body: `Hey,\n\nOne thing I wanted to note before I forget — will follow up properly soon.\n\nCheers,\nDakol` },
  { subject: 'Just a note', body: `Hi,\n\nJust a quick note to myself really, sent through a new address I'm setting up.\n\nSpeak soon,\nDakol` },
]

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomDelay(minMs: number, maxMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (maxMs - minMs)) + minMs))
}

async function sendOne(to: string, subject: string, text: string): Promise<string> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, text }),
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  const json = (await res.json()) as { id?: string }
  return json.id || 'n/a'
}

async function sendWarmupBatch() {
  // Random subset each run (3–5), so daily volume looks organic, not a fixed blast.
  const batchSize = Math.floor(Math.random() * 3) + 3 // 3 to 5
  const targets = shuffle(RECIPIENTS).slice(0, batchSize)
  const messages = shuffle(MESSAGES)

  console.log(`Warming ${FROM} → sending to ${targets.length} recipient(s)…\n`)

  for (let i = 0; i < targets.length; i++) {
    const to = targets[i]
    const msg = messages[i % messages.length]
    try {
      const id = await sendOne(to, msg.subject, msg.body)
      console.log(`✓ ${to} — "${msg.subject}" (id: ${id})`)
    } catch (err) {
      console.error(`✗ ${to}:`, err instanceof Error ? err.message : err)
    }
    if (i < targets.length - 1) await randomDelay(15000, 60000) // 15–60s between sends
  }

  console.log('\nWarmup batch complete.')
  console.log('→ Now go ENGAGE: open these, reply to a couple, mark any spam as "Not spam", star a few.')
}

sendWarmupBatch().catch((e) => {
  console.error(e)
  process.exit(1)
})
