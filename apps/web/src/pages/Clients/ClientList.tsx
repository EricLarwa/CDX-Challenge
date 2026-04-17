import { Link } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useClients } from '../../hooks/useClients';

export function ClientListPage() {
  const clientsQuery = useClients();
  const clients = clientsQuery.data ?? [];

  return (
    <div>
      <PageHeader title="Clients" description="Client balances and history are now connected to the API layer." />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {clientsQuery.isLoading ? <LoadingCard label="Loading clients..." /> : null}
        {!clientsQuery.isLoading && clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Once invoices start going out, this hub will show balances, terms, and payment history."
            actions={
              <>
                <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
                <ButtonLink to="/reports" tone="secondary">
                  Open reports
                </ButtonLink>
              </>
            }
          />
        ) : null}
        {clients.map((client) => (
          <Link
            key={client.id}
            to={`/clients/${client.id}`}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <strong>{client.name}</strong>
              <span>${client.outstanding} outstanding</span>
            </div>
            <div style={{ color: '#64748b', marginTop: '0.35rem' }}>
              Total invoiced ${client.totalInvoiced} · Terms {client.paymentTerms} days
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
