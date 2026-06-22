import React from 'react'
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { Invoice } from './invoices'

// DESIGN.md palette — carbon/crimson, applied as closely as react-pdf's default
// fonts (Helvetica family) allow without registering custom web fonts for v1.
const COLORS = {
  carbon: '#161618',
  carbonSurface: '#1E1E21',
  crimson: '#C1272D',
  warmWhite: '#FAF8F4',
  border: '#2C2C30',
  muted: '#8E8E92',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.warmWhite,
    color: COLORS.carbon,
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  wordmark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    letterSpacing: 1,
    color: COLORS.carbon,
  },
  subline: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.muted,
    marginTop: 2,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: COLORS.crimson,
    marginBottom: 4,
  },
  metaLine: {
    fontSize: 9,
    color: COLORS.muted,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLORS.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginBottom: 2,
  },
  clientEmail: {
    fontSize: 10,
    color: COLORS.muted,
  },
  table: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  colDescription: { width: '46%' },
  colQty: { width: '14%', textAlign: 'right' },
  colUnitPrice: { width: '20%', textAlign: 'right' },
  colAmount: { width: '20%', textAlign: 'right' },
  tableHeaderText: {
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.muted,
    textTransform: 'uppercase',
  },
  totalsBlock: {
    marginTop: 16,
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsLabel: {
    color: COLORS.muted,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: COLORS.crimson,
  },
  notes: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    fontSize: 9,
    color: COLORS.muted,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: 'center',
  },
})

const formatCurrency = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>DAKO</Text>
            <Text style={styles.subline}>STUDIOS</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.metaLine}>{invoice.invoiceNumber}</Text>
            <Text style={styles.metaLine}>{formatDate(invoice.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Billed To</Text>
          <Text style={styles.clientName}>{invoice.clientName || 'Client'}</Text>
          {invoice.clientEmail && <Text style={styles.clientEmail}>{invoice.clientEmail}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colDescription, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.colUnitPrice, styles.tableHeaderText]}>Unit Price</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colAmount}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax</Text>
            <Text>{formatCurrency(invoice.tax)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>Dako Studios — One Creative Studio. Every Edge.</Text>
      </Page>
    </Document>
  )
}

export async function renderInvoicePdf(invoice: Invoice): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument invoice={invoice} />)
}
