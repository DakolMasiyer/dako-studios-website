import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminRequest } from '@/lib/marketing-auth'
import { createInvoice, listInvoicesForLead, listAllInvoices } from '@/utils/invoices'
import { renderInvoicePdf } from '@/utils/invoice-pdf'
import { isSupabaseConfigured, getSupabaseAdmin } from '@/utils/supabase'

/**
 * POST -> create an invoice (+ items) for a lead, render its PDF, and attempt to store
 *         the PDF in the `invoices` Supabase Storage bucket. The bucket isn't provisioned
 *         yet in v1, so upload failure is non-fatal: pdf_path stays null and the response
 *         flags pdfStored: false with a message to create the bucket once in the dashboard.
 * GET  -> list invoices, optionally filtered by ?leadId=
 */

const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
})

const createSchema = z.object({
  leadId: z.string().min(1),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  items: z.array(itemSchema).min(1),
  notes: z.string().optional(),
})

export async function GET(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get('leadId')
    const invoices = leadId ? await listInvoicesForLead(leadId) : await listAllInvoices()
    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('GET /api/marketing/invoices failed:', error)
    return NextResponse.json({ error: 'Failed to load invoices' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const invoice = await createInvoice(parsed.data)
    const pdfBuffer = await renderInvoicePdf(invoice)

    let pdfStored = false
    let pdfMessage: string | undefined
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin()
        const path = `${invoice.id}/${invoice.invoiceNumber}.pdf`
        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(path, pdfBuffer, { contentType: 'application/pdf', upsert: true })
        if (uploadError) throw uploadError
        const { updateInvoiceStatus } = await import('@/utils/invoices')
        await updateInvoiceStatus(invoice.id, invoice.status, { pdfPath: path })
        invoice.pdfPath = path
        pdfStored = true
      } catch (err) {
        console.error('POST /api/marketing/invoices: PDF upload failed (bucket likely missing):', err)
        pdfMessage =
          "PDF could not be stored — the 'invoices' Storage bucket needs to be created once in the Supabase dashboard."
      }
    } else {
      pdfMessage = 'Supabase is not configured — PDF was generated but not stored.'
    }

    return NextResponse.json({ invoice, pdfStored, ...(pdfMessage ? { message: pdfMessage } : {}) })
  } catch (error) {
    console.error('POST /api/marketing/invoices failed:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
