/**
 * Gmail — READ ONLY reply detection for the outreach loop.
 *
 * Sending moved to Resend (see src/utils/email-send.ts) for DMARC alignment. Gmail is
 * now used only to detect prospect replies: cold mail goes out with Reply-To pointing
 * at outreach@mail.dako.studio, which Cloudflare Email Routing forwards into the Gmail
 * account this refresh token authorizes. We then search that inbox by the prospect's
 * from-address — no Gmail thread id needed (Resend sends aren't Gmail threads).
 *
 * OAuth scope required: gmail.readonly. Returns [] under dry-run.
 */
import { isDryRun } from './email-send'

export { isDryRun }

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN

export function isGmailConfigured(): boolean {
  return Boolean(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN)
}

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
  if (!res.ok) {
    throw new Error(`Gmail token refresh failed: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { access_token: string }
  return json.access_token
}

export interface ThreadReply {
  from: string
  date: string
  text: string
}

function decodeBody(data?: string): string {
  if (!data) return ''
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

interface GmailPart {
  mimeType?: string
  body?: { data?: string }
  parts?: GmailPart[]
}

function extractPlainText(payload: GmailPart): string {
  if (payload.mimeType === 'text/plain' && payload.body?.data) return decodeBody(payload.body.data)
  for (const part of payload.parts || []) {
    const t = extractPlainText(part)
    if (t) return t
  }
  return ''
}

/** Whole days since `sinceIso`, clamped to >= 1, for Gmail's `newer_than:Nd` filter. */
function daysSince(sinceIso?: string): number {
  if (!sinceIso) return 30
  const days = Math.ceil((Date.now() - new Date(sinceIso).getTime()) / 86_400_000)
  return Math.min(Math.max(days, 1), 60)
}

/**
 * Find replies from a given prospect email since we contacted them. Returns oldest →
 * newest, so the caller can take the most recent with `replies[replies.length - 1]`.
 * Returns [] in dry-run or when Gmail isn't configured.
 */
export async function findRepliesFrom(fromEmail: string, sinceIso?: string): Promise<ThreadReply[]> {
  if (isDryRun() || !isGmailConfigured()) return []

  const accessToken = await getAccessToken()
  const q = `from:${fromEmail} newer_than:${daysSince(sinceIso)}d`
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(q)}&maxResults=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!listRes.ok) {
    throw new Error(`Gmail message list failed: ${listRes.status} ${await listRes.text()}`)
  }
  const list = (await listRes.json()) as { messages?: { id: string }[] }
  if (!list.messages?.length) return []

  const replies: ThreadReply[] = []
  for (const { id } of list.messages) {
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!msgRes.ok) continue
    const msg = (await msgRes.json()) as {
      internalDate?: string
      payload?: { headers?: { name: string; value: string }[] } & GmailPart
    }
    const headers = msg.payload?.headers || []
    const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || fromEmail
    const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || ''
    const text = msg.payload ? extractPlainText(msg.payload) : ''
    if (text.trim()) replies.push({ from, date, text: text.trim() })
  }
  // Gmail lists newest-first; reverse so the latest reply is last.
  return replies.reverse()
}
