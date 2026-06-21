import { NextResponse } from 'next/server'
import { getLeads, updateLead, LeadStatus } from '@/utils/marketing-data'
import { findRepliesFrom, isDryRun } from '@/utils/gmail'
import { triageReply } from '@/utils/triage'
import { isAuthorizedCron } from '@/utils/cron-auth'

/**
 * Loop B — inbound half. For every lead we've contacted and not yet heard from
 * ('Sent' or 'Bumped'), check Gmail for a reply from the prospect's address. On a reply:
 *   1. Gemini triages it against dako-cold.md -> { stage, suggested_reply, reasoning }
 *   2. We store the suggestion on the lead and flip status to 'Replied' (or 'Lost'
 *      if triage judged it a clear no). We NEVER auto-send the reply — it waits in
 *      the dashboard for human review.
 *
 * DRY_RUN: findRepliesFrom returns [] while dry-run is on, so this route is a
 * no-op until OUTREACH_DRY_RUN=false and Gmail is configured.
 */

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (isDryRun()) {
    return NextResponse.json({ dryRun: true, note: 'Dry-run: reply polling disabled.', processed: 0 })
  }

  const leads = await getLeads()
  const awaiting = leads.filter(
    (l) => l.leadKind === 'outreach' && l.email && (l.status === 'Sent' || l.status === 'Bumped')
  )

  const triaged: { leadId: string; company?: string; stage: string }[] = []
  const errors: { leadId: string; error: string }[] = []

  for (const lead of awaiting) {
    try {
      const replies = await findRepliesFrom(lead.email as string, lead.sentAt)
      if (!replies.length) continue

      // Use the most recent prospect reply for triage.
      const latest = replies[replies.length - 1]
      const result = await triageReply(lead, latest.text)

      // A reply always surfaces for human review; only a clear "no" auto-marks Lost.
      const status: LeadStatus = result.stage === 'Lost' ? 'Lost' : 'Replied'
      await updateLead(lead.id, {
        status,
        suggested_reply: result.suggested_reply,
        suggested_reasoning: result.reasoning,
        last_contact_at: new Date().toISOString(),
      })
      triaged.push({ leadId: lead.id, company: lead.company, stage: result.stage })
    } catch (e) {
      errors.push({ leadId: lead.id, error: e instanceof Error ? e.message : String(e) })
    }
  }

  return NextResponse.json({
    dryRun: false,
    counts: { checked: awaiting.length, triaged: triaged.length, errors: errors.length },
    triaged,
    errors,
  })
}

export const GET = POST
