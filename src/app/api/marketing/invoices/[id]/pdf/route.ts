import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/marketing-auth'
import { getInvoice } from '@/utils/invoices'
import { isSupabaseConfigured, getSupabaseAdmin } from '@/utils/supabase'

/**
 * Returns a short-lived signed URL for an invoice's stored PDF — pdf_path is a private
 * Storage path, not directly fetchable from the browser.
 */

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const invoice = await getInvoice(id)
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }
  if (!invoice.pdfPath || !isSupabaseConfigured()) {
    return NextResponse.json({ error: 'No PDF stored for this invoice' }, { status: 404 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.from('invoices').createSignedUrl(invoice.pdfPath, 300)
  if (error || !data) {
    console.error('GET /api/marketing/invoices/[id]/pdf: signed URL failed:', error)
    return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
