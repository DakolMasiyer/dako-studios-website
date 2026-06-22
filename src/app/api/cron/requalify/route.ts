import { NextResponse } from 'next/server'
import { getLeads, updateLead } from '@/utils/marketing-data'
import { isFirecrawlConfigured } from '@/utils/firecrawl'
import { requalifyLead } from '@/utils/requalify'
import { isAuthorizedCron } from '@/utils/cron-auth'

/**
 * Loop C — requalification. Weekly cron. Re-enriches leads stuck at 'Low priority' with
 * a fresh website/Instagram look, redrafts the qualification + opener via the same engine
 * as Loop A, and stamps requalified_at so a lead is only ever revisited once by this loop.
 *
 * Sends no email — only Loop B sends, and only with email_approved: true set by a human.
 */

export const dynamic = 'force-dynamic'

// Keep small and explicit: Firecrawl credits are a real, finite resource this loop
// spends per lead (a website search + an Instagram search + up to two page inspects).
const REQUALIFY_BATCH = Number(process.env.REQUALIFY_BATCH) || 5

export async function POST(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isFirecrawlConfigured()) {
    return NextResponse.json({ note: 'Firecrawl not configured — requalification idle.', processed: 0 })
  }

  const leads = await getLeads()
  const candidates = leads
    .filter((l) => l.leadKind === 'outreach' && l.qualificationStatus === 'Low priority' && !l.requalifiedAt)
    .slice(0, REQUALIFY_BATCH)

  const results: { leadId: string; company?: string; qualificationStatus: string }[] = []
  const errors: { leadId: string; company?: string; error: string }[] = []

  for (const lead of candidates) {
    if (!lead.arm) {
      errors.push({ leadId: lead.id, company: lead.company, error: 'lead has no arm set, skipped' })
      continue
    }
    try {
      const result = await requalifyLead({
        id: lead.id,
        company: lead.company || 'Unknown',
        industry: lead.industry,
        address: lead.address,
        arm: lead.arm,
      })
      await updateLead(lead.id, { requalified_at: new Date().toISOString() })
      results.push({ leadId: lead.id, company: lead.company, qualificationStatus: result.qualificationStatus })
    } catch (e) {
      errors.push({ leadId: lead.id, company: lead.company, error: e instanceof Error ? e.message : String(e) })
    }
  }

  return NextResponse.json({
    counts: { candidates: candidates.length, processed: results.length, errors: errors.length },
    results,
    errors,
  })
}

export const GET = POST
