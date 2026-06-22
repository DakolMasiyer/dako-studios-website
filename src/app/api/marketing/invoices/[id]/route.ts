import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminRequest } from '@/lib/marketing-auth'
import { updateInvoiceStatus } from '@/utils/invoices'

const patchSchema = z.object({
  status: z.enum(['Paid', 'Void']),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      )
    }
    const extra = parsed.data.status === 'Paid' ? { paidAt: new Date().toISOString() } : undefined
    const ok = await updateInvoiceStatus(id, parsed.data.status, extra)
    if (!ok) {
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/marketing/invoices/[id] failed:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
