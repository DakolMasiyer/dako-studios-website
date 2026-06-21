import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getLeads, updateLead } from '@/utils/marketing-data'
import { sendOutreachEmail, isDryRun } from '@/utils/email-send'
import { isAdminRequest } from '@/lib/marketing-auth'

/**
 * Human-approved reply send. The dashboard posts the (possibly edited) reply text
 * here; we send it in the existing thread and advance the lead. This is the ONLY
 * path that sends a reply to an engaged prospect — operated by a human, never by the
 * poll cron. Admin-gated. Still subject to OUTREACH_DRY_RUN (simulated while on).
 */

const bodySchema = z.object({
  reply: z.string().min(1),
  // Optional stage to set after sending (e.g. 'Proposal Sent', 'Contacted').
  status: z.string().optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.format() }, { status: 400 })
    }

    const lead = (await getLeads()).find((l) => l.id === id)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!lead.email) return NextResponse.json({ error: 'Lead has no email' }, { status: 400 })

    await sendOutreachEmail({
      to: lead.email,
      subject: `Re: A quick video idea for ${lead.company || 'your brand'}`,
      text: parsed.data.reply,
      // Reply under the opener's Message-ID so it threads in the prospect's client.
      inReplyTo: lead.messageId,
    })

    await updateLead(id, {
      status: (parsed.data.status as any) || 'Contacted',
      last_contact_at: new Date().toISOString(),
      // keep message_id as the opener's so further follow-ups stay in-thread
      // clear the suggestion now that a human has acted on it
      suggested_reply: null,
      suggested_reasoning: null,
    })

    return NextResponse.json({ success: true, dryRun: isDryRun() })
  } catch (error) {
    console.error('reply send failed:', error)
    return NextResponse.json(
      { error: 'Failed to send reply', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
