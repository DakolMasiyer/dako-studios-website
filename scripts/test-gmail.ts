/**
 * Gmail connection probe — verifies the read-only reply-detection path WITHOUT sending
 * anything and WITHOUT the OUTREACH_DRY_RUN gate (this is a deliberate connection test).
 *
 *   1. Refreshes the OAuth access token (GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN).
 *   2. Reads the Gmail profile -> prints WHICH inbox the token authorizes. This must
 *      match the Cloudflare Email Routing destination for outreach@mail.dako.studio.
 *   3. Lists the 5 most recent messages (proves gmail.readonly scope works).
 *   4. Optional: pass a prospect email to run the exact query the poll loop uses
 *      (`from:<addr> newer_than:30d`).
 *
 * Run:  pnpm test:gmail
 *       pnpm test:gmail someone@example.com
 */
import fs from 'fs'
import path from 'path'

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

const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID as string,
      client_secret: GMAIL_CLIENT_SECRET as string,
      refresh_token: GMAIL_REFRESH_TOKEN as string,
      grant_type: 'refresh_token',
    }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Token refresh failed (${res.status}): ${body}`)
  return (JSON.parse(body) as { access_token: string }).access_token
}

async function gget(url: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const body = await res.text()
  if (!res.ok) throw new Error(`${url}\n  -> ${res.status}: ${body}`)
  return JSON.parse(body)
}

function header(headers: { name: string; value: string }[], name: string) {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

async function main() {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.error('❌ Missing GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN in .env.local')
    process.exit(1)
  }

  console.log('1) Refreshing access token…')
  const token = await getAccessToken()
  console.log('   ✅ token acquired\n')

  console.log('2) Reading Gmail profile (which inbox does this token control?)…')
  const profile = await gget('https://gmail.googleapis.com/gmail/v1/users/me/profile', token)
  console.log(`   ✅ inbox: ${profile.emailAddress}  (total messages: ${profile.messagesTotal})`)
  console.log('   ⚠️  This MUST match the Cloudflare route destination for outreach@mail.dako.studio\n')

  console.log('3) Listing 5 most recent messages…')
  const list = await gget('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', token)
  for (const m of list.messages || []) {
    const msg = await gget(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`, token)
    const h = msg.payload?.headers || []
    console.log(`   • ${header(h, 'From').slice(0, 45).padEnd(45)} | ${header(h, 'Subject').slice(0, 50)}`)
  }
  console.log('   ✅ read scope works\n')

  const fromArg = process.argv.find((a) => a.includes('@'))
  if (fromArg) {
    const q = encodeURIComponent(`from:${fromArg} newer_than:30d`)
    console.log(`4) Running the poll-loop query: from:${fromArg} newer_than:30d`)
    const res = await gget(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=5`, token)
    console.log(`   ✅ ${res.resultSizeEstimate ?? (res.messages?.length || 0)} match(es) — this is what outreach-poll would triage`)
  } else {
    console.log('4) (skipped) pass a prospect email to test the exact poll query, e.g.:')
    console.log('   pnpm test:gmail prospect@example.com')
  }

  console.log('\n✅ Gmail reply-detection path is reachable.')
}

main().catch((e) => {
  console.error('\n❌ Gmail probe failed:\n', e instanceof Error ? e.message : e)
  process.exit(1)
})
