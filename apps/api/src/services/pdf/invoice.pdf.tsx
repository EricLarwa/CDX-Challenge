import type { InvoiceRecord } from '@financeos/shared';
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, color: '#111827' },
  title: { fontSize: 20, marginBottom: 16 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  tableHeader: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
});

function InvoicePdfDocument(props: { invoice: InvoiceRecord }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice {props.invoice.invoiceNumber}</Text>
        <View style={styles.section}>
          <Text>Client: {props.invoice.clientName ?? 'Unknown client'}</Text>
          <Text>Issue date: {new Date(props.invoice.issueDate).toLocaleDateString()}</Text>
          <Text>Due date: {new Date(props.invoice.dueDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.tableHeader}>Line items</Text>
          {props.invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text>{item.description}</Text>
              <Text>${item.total}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Subtotal: ${props.invoice.subtotal}</Text>
          <Text>Tax: ${props.invoice.taxAmount}</Text>
          <Text>Total: ${props.invoice.total}</Text>
          <Text>Amount paid: ${props.invoice.amountPaid}</Text>
        </View>
        {props.invoice.notes ? (
          <View style={styles.section}>
            <Text>Notes</Text>
            <Text>{props.invoice.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export const renderInvoicePdf = async (invoice: InvoiceRecord) => {
  try {
    return await renderToBuffer(<InvoicePdfDocument invoice={invoice} />);
  } catch (error) {
    console.error('Invoice PDF generation failed.', error);
    return Buffer.from(`Invoice ${invoice.invoiceNumber}\nTotal: $${invoice.total}`);
  }
};
