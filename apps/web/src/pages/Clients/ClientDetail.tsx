import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/shared/PageHeader';
import { useClientDetail } from '../../hooks/useClients';

export function ClientDetailPage() {
  const { id } = useParams();
  const clientQuery = useClientDetail(id);
  const client = clientQuery.data;

  return (
    <div>
      <PageHeader
        title={client?.name ?? 'Client detail'}
        description={client ? `Payment terms: ${client.paymentTerms} days` : 'Invoice history and payment behavior render here.'}
      />
      {client ? (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {client.invoices.map((invoice) => (
            <div key={invoice.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{invoice.invoiceNumber}</strong>
                <span>{invoice.status}</span>
              </div>
              <div style={{ marginTop: '0.4rem', color: '#64748b' }}>
                Total ${invoice.total} · Paid ${invoice.amountPaid}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
