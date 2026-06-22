import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/marketing-auth'
import { getInvoice, updateInvoiceStatus } from '@/utils/invoices'
import { isInvoiceDryRun } from '@/utils/email-send'
import { isSupabaseConfigured, getSupabaseAdmin } from '@/utils/supabase'

/**
 * Sends the invoice email (HTML body + PDF attachment when available) via Resend.
 * Mirrors the dry-run-gate + human-approval convention used for outreach sends:
 * while INVOICE_DRY_RUN !== 'false', this logs the would-be send and writes nothing.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const INVOICE_FROM = process.env.INVOICE_FROM || 'Dako Studios <billing@mail.dako.studio>'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const invoice = await getInvoice(id)
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }
  if (!invoice.clientEmail) {
    return NextResponse.json({ error: 'Invoice has no client email to send to' }, { status: 400 })
  }

  const html = `
    <p>Hi ${invoice.clientName || 'there'},</p>
    <p>Please find your invoice <strong>${invoice.invoiceNumber}</strong> from Dako Studios attached${invoice.pdfPath ? '' : ' (PDF not attached — see total below)'}.</p>
    <p><strong>Total due: $${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
    <p>Thanks for working with us.<br/>Dako Studios</p>
  `

  const dry = isInvoiceDryRun()
  if (dry) {
    console.log(
      `[DRY_RUN] Would send invoice ${invoice.invoiceNumber} via Resend to ${invoice.clientEmail} | from: ${INVOICE_FROM}` +
        `${invoice.pdfPath ? ' | with PDF attachment' : ' | no PDF attached'}\n--- body ---\n${html}\n------------`
    )
    return NextResponse.json({ dryRun: true, message: 'Dry run — no email sent.' })
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend is not configured. Set RESEND_API_KEY.' }, { status: 500 })
  }

  let attachments: { filename: string; content: string }[] | undefined
  let pdfAttached = false
  if (invoice.pdfPath && isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase.storage.from('invoices').download(invoice.pdfPath)
      if (error || !data) throw error || new Error('empty download')
      const buffer = Buffer.from(await data.arrayBuffer())
      attachments = [{ filename: `${invoice.invoiceNumber}.pdf`, content: buffer.toString('base64') }]
      pdfAttached = true
    } catch (err) {
      console.error('Invoice send: failed to fetch PDF from Storage, sending HTML only:', err)
    }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: INVOICE_FROM,
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from Dako Studios`,
      html,
      ...(attachments ? { attachments } : {}),
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Invoice send: Resend request failed:', res.status, text)
    return NextResponse.json({ error: `Resend send failed: ${res.status}` }, { status: 502 })
  }

  const now = new Date().toISOString()
  const ok = await updateInvoiceStatus(id, 'Sent', { sentAt: now })
  if (!ok) {
    return NextResponse.json({ error: 'Email sent, but failed to update invoice status' }, { status: 500 })
  }

  return NextResponse.json({ dryRun: false, pdfAttached, sentAt: now })
}
