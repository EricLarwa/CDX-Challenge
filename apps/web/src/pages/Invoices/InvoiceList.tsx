import { PageHeader } from '../../components/shared/PageHeader';
import { useInvoices } from '../../hooks/useInvoices';

export function InvoiceListPage() {
  const invoicesQuery = useInvoices();
  const invoices = invoicesQuery.data?.items ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Invoicing"
        title="Invoices"
        description="The list is now wired to the API contract and ready for table polish, filters, and status badges."
      />
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '0.85rem' }}>Invoice</th>
              <th style={{ padding: '0.85rem' }}>Status</th>
              <th style={{ padding: '0.85rem' }}>Due</th>
              <th style={{ padding: '0.85rem', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.85rem' }}>{invoice.invoiceNumber}</td>
                <td style={{ padding: '0.85rem' }}>{invoice.status}</td>
                <td style={{ padding: '0.85rem' }}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td style={{ padding: '0.85rem', textAlign: 'right' }}>${invoice.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
