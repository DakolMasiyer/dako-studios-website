/**
 * Outreach send layer — Resend.
 *
 * We send cold outreach through Resend (not Gmail) so the message is DKIM-signed as
 * our actual domain (outreach@mail.dako.studio). SPF + DKIM then align with the From
 * domain and DMARC passes cleanly — which Gmail "send mail as" cannot do (it signs as
 * 1e100.net, failing DMARC alignment).
 *
 * Reply detection lives separately in src/utils/gmail.ts (read-only): we set Reply-To
 * to an inbox that Cloudflare Email Routing forwards into Gmail, and poll it by the
 * prospect's from-address.
 *
 * SAFETY: every send is gated behind OUTREACH_DRY_RUN. While dry-run is on (default),
 * sendOutreachEmail logs the would-be message and returns a synthetic id WITHOUT
 * contacting Resend. Nothing leaves an inbox until OUTREACH_DRY_RUN=false.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
// e.g. 'Dakol <outreach@mail.dako.studio>'
const OUTREACH_FROM = process.env.OUTREACH_FROM || 'Dakol <outreach@mail.dako.studio>'
// Where replies should go (forwarded into the Gmail the poll loop reads).
const OUTREACH_REPLY_TO = process.env.OUTREACH_REPLY_TO || 'outreach@mail.dako.studio'

/** Dry-run unless explicitly disabled. Any value other than the string "false" = dry-run. */
export function isDryRun(): boolean {
  return process.env.OUTREACH_DRY_RUN !== 'false'
}

export function isSendConfigured(): boolean {
  return Boolean(RESEND_API_KEY)
}

/** Domain used to mint our own Message-ID (derived from the From address). */
function messageIdDomain(): string {
  const match = OUTREACH_FROM.match(/@([^>\s]+)/)
  return process.env.OUTREACH_MSGID_DOMAIN || (match ? match[1] : 'mail.dako.studio')
}

function generateMessageId(leadId?: string): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `<outreach-${leadId || 'x'}-${Date.now()}-${rand}@${messageIdDomain()}>`
}

export interface SendOutreachArgs {
  to: string
  subject: string
  text: string
  /** Used to mint a deterministic-ish Message-ID for the opener. */
  leadId?: string
  /** Original opener Message-ID — threads follow-ups in the prospect's client. */
  inReplyTo?: string
}

export interface SendOutreachResult {
  /** Resend's email id (or a synthetic one in dry-run). */
  id: string
  /** The RFC Message-ID we set on this message. */
  messageId: string
  dryRun: boolean
}

export async function sendOutreachEmail(args: SendOutreachArgs): Promise<SendOutreachResult> {
  const messageId = generateMessageId(args.leadId)

  if (isDryRun()) {
    console.log(
      `[DRY_RUN] Would send via Resend to ${args.to} | from: ${OUTREACH_FROM} | subject: "${args.subject}"` +
        `${args.inReplyTo ? ` | in-reply-to: ${args.inReplyTo}` : ''}\n--- body ---\n${args.text}\n------------`
    )
    return { id: `dryrun_${Date.now()}`, messageId, dryRun: true }
  }

  if (!isSendConfigured()) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY.')
  }

  const headers: Record<string, string> = { 'Message-ID': messageId }
  if (args.inReplyTo) {
    headers['In-Reply-To'] = args.inReplyTo
    headers['References'] = args.inReplyTo
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: OUTREACH_FROM,
      to: args.to,
      subject: args.subject,
      text: args.text,
      reply_to: OUTREACH_REPLY_TO,
      headers,
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { id: string }
  return { id: json.id, messageId, dryRun: false }
}
