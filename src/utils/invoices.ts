import { isSupabaseConfigured, getSupabaseAdmin } from './supabase'

export interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  sortOrder: number
}

export interface Invoice {
  id: string
  leadId: string
  invoiceNumber: string
  status: 'Draft' | 'Sent' | 'Paid' | 'Void'
  clientName?: string
  clientEmail?: string
  subtotal: number
  tax: number
  total: number
  notes?: string
  pdfPath?: string
  createdAt: string
  sentAt?: string
  paidAt?: string
  items: InvoiceItem[]
}

interface InvoiceRow {
  id: string
  lead_id: string
  invoice_number: string
  status: Invoice['status']
  client_name: string | null
  client_email: string | null
  subtotal: number
  tax: number
  total: number
  notes: string | null
  pdf_path: string | null
  created_at: string
  sent_at: string | null
  paid_at: string | null
}

interface InvoiceItemRow {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  sort_order: number
}

function mapRowToItem(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    amount: row.amount,
    sortOrder: row.sort_order,
  }
}

function mapRowToInvoice(row: InvoiceRow, items: InvoiceItemRow[] = []): Invoice {
  return {
    id: row.id,
    leadId: row.lead_id,
    invoiceNumber: row.invoice_number,
    status: row.status,
    clientName: row.client_name ?? undefined,
    clientEmail: row.client_email ?? undefined,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    notes: row.notes ?? undefined,
    pdfPath: row.pdf_path ?? undefined,
    createdAt: row.created_at,
    sentAt: row.sent_at ?? undefined,
    paidAt: row.paid_at ?? undefined,
    items: items.sort((a, b) => a.sort_order - b.sort_order).map(mapRowToItem),
  }
}

/** Format: INV-{year}-{zero-padded sequence}, derived from a count of that year's invoices. */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  if (!isSupabaseConfigured()) return `INV-${year}-0001`
  const supabase = getSupabaseAdmin()
  const yearStart = `${year}-01-01T00:00:00.000Z`
  const yearEnd = `${year + 1}-01-01T00:00:00.000Z`
  const { count, error } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', yearStart)
    .lt('created_at', yearEnd)
  if (error) {
    console.error('generateInvoiceNumber: count query failed:', error)
  }
  const seq = (count ?? 0) + 1
  return `INV-${year}-${String(seq).padStart(4, '0')}`
}

export interface NewInvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface NewInvoice {
  leadId: string
  clientName?: string
  clientEmail?: string
  items: NewInvoiceItem[]
  notes?: string
}

export async function createInvoice(input: NewInvoice): Promise<Invoice> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }
  const supabase = getSupabaseAdmin()
  const invoiceNumber = await generateInvoiceNumber()

  const itemsWithAmounts = input.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    amount: item.quantity * item.unitPrice,
  }))
  const subtotal = itemsWithAmounts.reduce((sum, i) => sum + i.amount, 0)
  const tax = 0
  const total = subtotal + tax

  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      lead_id: input.leadId,
      invoice_number: invoiceNumber,
      status: 'Draft',
      client_name: input.clientName ?? null,
      client_email: input.clientEmail ?? null,
      subtotal,
      tax,
      total,
      notes: input.notes ?? null,
    })
    .select('*')
    .single()
  if (invoiceError || !invoiceRow) {
    throw new Error(`createInvoice: failed to insert invoice: ${invoiceError?.message}`)
  }

  let itemRows: InvoiceItemRow[] = []
  if (itemsWithAmounts.length > 0) {
    const { data, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        itemsWithAmounts.map((item, idx) => ({
          invoice_id: invoiceRow.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          sort_order: idx,
        }))
      )
      .select('*')
    if (itemsError) {
      throw new Error(`createInvoice: failed to insert items: ${itemsError.message}`)
    }
    itemRows = (data ?? []) as InvoiceItemRow[]
  }

  return mapRowToInvoice(invoiceRow as InvoiceRow, itemRows)
}

export async function listInvoicesForLead(leadId: string): Promise<Invoice[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = getSupabaseAdmin()
  const { data: invoiceRows, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('listInvoicesForLead failed:', error)
    return []
  }
  return listWithItems((invoiceRows ?? []) as InvoiceRow[])
}

export async function listAllInvoices(): Promise<Invoice[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = getSupabaseAdmin()
  const { data: invoiceRows, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('listAllInvoices failed:', error)
    return []
  }
  return listWithItems((invoiceRows ?? []) as InvoiceRow[])
}

async function listWithItems(invoiceRows: InvoiceRow[]): Promise<Invoice[]> {
  if (invoiceRows.length === 0) return []
  const supabase = getSupabaseAdmin()
  const ids = invoiceRows.map((r) => r.id)
  const { data: itemRows, error } = await supabase
    .from('invoice_items')
    .select('*')
    .in('invoice_id', ids)
  if (error) {
    console.error('listWithItems: failed to load invoice_items:', error)
  }
  const itemsByInvoice = new Map<string, InvoiceItemRow[]>()
  for (const item of (itemRows ?? []) as InvoiceItemRow[]) {
    const list = itemsByInvoice.get(item.invoice_id) ?? []
    list.push(item)
    itemsByInvoice.set(item.invoice_id, list)
  }
  return invoiceRows.map((row) => mapRowToInvoice(row, itemsByInvoice.get(row.id) ?? []))
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = getSupabaseAdmin()
  const { data: invoiceRow, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !invoiceRow) return null
  const { data: itemRows, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', id)
  if (itemsError) {
    console.error('getInvoice: failed to load invoice_items:', itemsError)
  }
  return mapRowToInvoice(invoiceRow as InvoiceRow, (itemRows ?? []) as InvoiceItemRow[])
}

export interface UpdateInvoiceStatusExtra {
  pdfPath?: string
  sentAt?: string
  paidAt?: string
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice['status'],
  extra?: UpdateInvoiceStatusExtra
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const supabase = getSupabaseAdmin()
  const patch: Record<string, unknown> = { status }
  if (extra?.pdfPath !== undefined) patch.pdf_path = extra.pdfPath
  if (extra?.sentAt !== undefined) patch.sent_at = extra.sentAt
  if (extra?.paidAt !== undefined) patch.paid_at = extra.paidAt
  const { error } = await supabase.from('invoices').update(patch).eq('id', id)
  if (error) {
    console.error('updateInvoiceStatus failed:', error)
    return false
  }
  return true
}
