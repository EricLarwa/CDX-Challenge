import { Link, useParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
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
        actions={<ButtonLink to="/clients">Back to clients</ButtonLink>}
      />
      {client ? (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {client.invoices.map((invoice) => (
            <div key={invoice.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <Link to={`/invoices/${invoice.id}`} style={{ color: '#312e81', fontWeight: 700, textDecoration: 'none' }}>
                  {invoice.invoiceNumber}
                </Link>
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
