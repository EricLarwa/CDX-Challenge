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
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, `Invoice ${props.invoice.invoiceNumber}`),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, null, `Client: ${props.invoice.clientName ?? 'Unknown client'}`),
        React.createElement(
          Text,
          null,
          `Issue date: ${new Date(props.invoice.issueDate).toLocaleDateString()}`,
        ),
        React.createElement(
          Text,
          null,
          `Due date: ${new Date(props.invoice.dueDate).toLocaleDateString()}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.tableHeader }, 'Line items'),
        props.invoice.lineItems.map((item) =>
          React.createElement(
            View,
            { key: item.id, style: styles.row },
            React.createElement(Text, null, item.description),
            React.createElement(Text, null, `$${item.total}`),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, null, `Subtotal: $${props.invoice.subtotal}`),
        React.createElement(Text, null, `Tax: $${props.invoice.taxAmount}`),
        React.createElement(Text, null, `Total: $${props.invoice.total}`),
        React.createElement(Text, null, `Amount paid: $${props.invoice.amountPaid}`),
      ),
      props.invoice.notes
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(Text, null, 'Notes'),
            React.createElement(Text, null, props.invoice.notes),
          )
        : null,
    ),
  );
}

export const renderInvoicePdf = async (invoice: InvoiceRecord) => {
  try {
    return await renderToBuffer(InvoicePdfDocument({ invoice }));
  } catch (error) {
    console.error('Invoice PDF generation failed.', error);
    return Buffer.from(`Invoice ${invoice.invoiceNumber}\nTotal: $${invoice.total}`);
  }
};
