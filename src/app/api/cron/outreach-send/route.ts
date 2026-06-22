import { NextResponse } from 'next/server'
import { getLeads, updateLead, Lead } from '@/utils/marketing-data'
import { buildOpener, buildBump, buildBreakup } from '@/utils/outreach-templates'
import { sendOutreachEmail, isDryRun } from '@/utils/email-send'
import { isAuthorizedCron } from '@/utils/cron-auth'

/**
 * Loop B — outbound. Runs on a daily cron (Lagos/Abuja business hours).
 *   - New openers:  status 'Not sent'  -> send Template A/B/C, mark 'Sent'
 *   - Bump:         status 'Sent'   + >4 days, no reply  -> in-thread nudge, mark 'Bumped'
 *   - Breakup:      status 'Bumped' + >5 days since bump  -> easy-out, mark 'Breakup sent', stop
 *
 * Reply detection lives in /api/cron/outreach-poll, which flips a lead to 'Replied'
 * the moment a prospect responds — so anyone still in 'Sent'/'Bumped' here is a
 * genuine non-replier.
 *
 * DRY_RUN: while OUTREACH_DRY_RUN !== 'false', this route SENDS NOTHING and WRITES
 * NOTHING — it returns the actions it *would* take, for review. Flip the flag to go live.
 */

export const dynamic = 'force-dynamic'

// Max new openers per run. Start LOW (5) while the domain is young, then ramp up over
// ~a week by raising OUTREACH_OPENER_BATCH (e.g. 5 → 8 → 12 → 20) — no code change needed.
const OPENER_BATCH = Number(process.env.OUTREACH_OPENER_BATCH) || 5
const BUMP_AFTER_DAYS = 4
const BREAKUP_AFTER_BUMP_DAYS = 5

const daysAgo = (iso?: string) =>
  iso ? (Date.now() - new Date(iso).getTime()) / 86_400_000 : Infinity

interface Action {
  leadId: string
  company?: string
  kind: 'opener' | 'bump' | 'breakup'
  to?: string
  subject: string
}

export async function POST(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dry = isDryRun()
  const leads = await getLeads()
  const outreach = leads.filter((l) => l.leadKind === 'outreach' && l.email)

  const planned: Action[] = []
  const errors: { leadId: string; error: string }[] = []

  const openers = outreach
    .filter((l) => l.status === 'Not sent' && (!l.customizedEmailBody || l.emailApproved === true))
    .slice(0, OPENER_BATCH)
  const bumps = outreach.filter((l) => l.status === 'Sent' && daysAgo(l.sentAt) >= BUMP_AFTER_DAYS)
  const breakups = outreach.filter(
    (l) => l.status === 'Bumped' && daysAgo(l.lastContactAt) >= BREAKUP_AFTER_BUMP_DAYS
  )

  async function run(lead: Lead, kind: Action['kind']) {
    // Bump/breakup always use the live template — qualification only pre-generates openers for now.
    const email =
      kind === 'opener'
        ? lead.customizedEmailBody
          ? { subject: lead.customizedEmailSubject || '(no subject)', body: lead.customizedEmailBody }
          : buildOpener(lead)
        : kind === 'bump'
          ? buildBump(lead)
          : buildBreakup(lead)
    planned.push({ leadId: lead.id, company: lead.company, kind, to: lead.email, subject: email.subject })
    if (dry) return // simulate only — no send, no DB write

    try {
      const result = await sendOutreachEmail({
        to: lead.email as string,
        subject: email.subject,
        text: email.body,
        leadId: kind === 'opener' ? lead.id : undefined,
        // Thread follow-ups under the opener's Message-ID (stored at opener send).
        inReplyTo: kind === 'opener' ? undefined : lead.messageId,
      })
      const now = new Date().toISOString()
      if (kind === 'opener') {
        await updateLead(lead.id, {
          status: 'Sent',
          sent_at: now,
          last_contact_at: now,
          message_id: result.messageId, // our Message-ID — follow-ups reference this
        })
      } else if (kind === 'bump') {
        await updateLead(lead.id, { status: 'Bumped', last_contact_at: now })
      } else {
        await updateLead(lead.id, { status: 'Breakup sent', last_contact_at: now })
      }
    } catch (e) {
      errors.push({ leadId: lead.id, error: e instanceof Error ? e.message : String(e) })
    }
  }

  // Process sequentially to keep send volume gentle and avoid hammering the API.
  for (const l of openers) await run(l, 'opener')
  for (const l of bumps) await run(l, 'bump')
  for (const l of breakups) await run(l, 'breakup')

  return NextResponse.json({
    dryRun: dry,
    counts: { openers: openers.length, bumps: bumps.length, breakups: breakups.length, errors: errors.length },
    planned,
    errors,
  })
}

// Allow manual GET triggering in dev (still dry-run gated).
export const GET = POST
