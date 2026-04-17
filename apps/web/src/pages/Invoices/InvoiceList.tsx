import { Link } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useInvoices } from '../../hooks/useInvoices';

const statusTone: Record<string, { bg: string; fg: string }> = {
  DRAFT: { bg: '#e2e8f0', fg: '#334155' },
  SENT: { bg: '#fef3c7', fg: '#92400e' },
  VIEWED: { bg: '#dbeafe', fg: '#1d4ed8' },
  PARTIALLY_PAID: { bg: '#fde68a', fg: '#92400e' },
  PAID: { bg: '#dcfce7', fg: '#166534' },
  OVERDUE: { bg: '#fee2e2', fg: '#b91c1c' },
  CANCELLED: { bg: '#e5e7eb', fg: '#4b5563' },
};

export function InvoiceListPage() {
  const invoicesQuery = useInvoices();
  const invoices = invoicesQuery.data?.items ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Invoicing"
        title="Invoices"
        description="The list is now wired to the API contract and ready for table polish, filters, and status badges."
        actions={<ButtonLink to="/invoices/new">New invoice</ButtonLink>}
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
                <td style={{ padding: '0.85rem' }}>
                  <Link to={`/invoices/${invoice.id}`} style={{ color: '#312e81', fontWeight: 700, textDecoration: 'none' }}>
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td style={{ padding: '0.85rem' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '999px',
                      background: statusTone[invoice.status]?.bg ?? '#e2e8f0',
                      color: statusTone[invoice.status]?.fg ?? '#334155',
                      fontWeight: 700,
                    }}
                  >
                    {invoice.status}
                  </span>
                </td>
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
