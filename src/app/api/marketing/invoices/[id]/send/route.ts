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

  const dateFormatted = new Date(invoice.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice from Dako Studios</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F2EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F2EE; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Email Container -->
            <table border="0" cellpadding="0" cellspacing="0" width="560" style="background-color: #FAF8F4; border: 1px solid #E4E2DE; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(22, 22, 24, 0.02);">
              
              <!-- Top Accent Line -->
              <tr>
                <td height="4" style="background-color: #C1272D; line-height: 4px; font-size: 4px;">&nbsp;</td>
              </tr>

              <!-- Header with Logo -->
              <tr>
                <td style="padding: 36px 36px 20px 36px; text-align: left;">
                  <img src="https://www.dako.studio/assets/logo-light.svg" alt="Dako Studios Logo" width="180" style="display: block; border: 0; outline: none;" />
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 36px;">
                  <hr style="border: 0; border-top: 1px solid #E4E2DE; margin: 0;" />
                </td>
              </tr>

              <!-- Email Content Body -->
              <tr>
                <td style="padding: 28px 36px 36px 36px; color: #161618; font-size: 14px; line-height: 1.6;">
                  <h1 style="font-family: system-ui, -apple-system, sans-serif; font-size: 20px; font-weight: 800; color: #161618; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.02em;">
                    Invoice ${invoice.invoiceNumber}
                  </h1>

                  <p style="margin: 0 0 16px 0; font-weight: 500;">Hi ${invoice.clientName || 'there'},</p>
                  
                  <p style="margin: 0 0 24px 0; color: #3a3a3c;">Please find attached your invoice <strong>${invoice.invoiceNumber}</strong> from Dako Studios${invoice.pdfPath ? '.' : ' (summary details below).'}</p>

                  <!-- Invoice Summary Box -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F2EE; border: 1px solid #E4E2DE; border-radius: 6px; margin-bottom: 28px;">
                    <tr>
                      <td style="padding: 18px; font-size: 13px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="color: #636367; padding-bottom: 8px;">Invoice Number:</td>
                            <td align="right" style="font-weight: 600; color: #161618; padding-bottom: 8px;">${invoice.invoiceNumber}</td>
                          </tr>
                          <tr>
                            <td style="color: #636367; padding-bottom: 8px;">Date Issued:</td>
                            <td align="right" style="color: #161618; padding-bottom: 8px;">${dateFormatted}</td>
                          </tr>
                          <tr style="font-size: 15px;">
                            <td style="color: #161618; font-weight: 700; padding-top: 12px; border-top: 1px solid #E4E2DE;">Amount Due:</td>
                            <td align="right" style="color: #C1272D; font-weight: 700; padding-top: 12px; border-top: 1px solid #E4E2DE;">$${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; color: #3a3a3c;">If you have any questions or need anything else, feel free to reply directly to this email.</p>
                  
                  <p style="margin: 0; color: #636367;">
                    Best regards,<br />
                    <strong style="color: #161618;">Dako Studios</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F4F2EE; padding: 20px 36px; text-align: center; color: #8E8E92; font-size: 10px; border-top: 1px solid #E4E2DE;">
                  <p style="margin: 0 0 4px 0; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 700; color: #636367;">
                    Dako Studios
                  </p>
                  <p style="margin: 0;">
                    One Creative Studio. Every Edge.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
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
