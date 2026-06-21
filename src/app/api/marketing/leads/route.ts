import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getLeads, updateLead, LeadStatus } from '@/utils/marketing-data'
import { isAdminRequest } from '@/lib/marketing-auth'

/**
 * Single write path for lead mutations from the dashboard CRM. Admin-gated via the
 * signed dako_marketing_token cookie (same gate as /api/marketing/status).
 * GET   -> list all leads (outreach + inbound)
 * PATCH -> update a lead's status / notes (and, for the reply flow, suggested_reply)
 *
 * The cron send/poll routes update leads through the same utils layer (updateLead)
 * so the dashboard stays the single source of truth.
 */

const STATUSES: LeadStatus[] = [
  'Not sent', 'Sent', 'Bumped', 'Replied', 'Breakup sent',
  'Identified', 'Contacted', 'Proposal Sent', 'Closed', 'Lost',
]

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(STATUSES as [LeadStatus, ...LeadStatus[]]).optional(),
  notes: z.string().optional(),
  suggested_reply: z.string().nullable().optional(),
}).refine(
  (v) => v.status !== undefined || v.notes !== undefined || v.suggested_reply !== undefined,
  { message: 'Provide at least one field to update.' }
)

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const leads = await getLeads()
    return NextResponse.json({ leads })
  } catch (error) {
    console.error('GET /api/marketing/leads failed:', error)
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      )
    }
    const { id, status, notes, suggested_reply } = parsed.data
    const ok = await updateLead(id, {
      ...(status !== undefined ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(suggested_reply !== undefined ? { suggested_reply } : {}),
    })
    if (!ok) {
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/marketing/leads failed:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
