import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/shared/PageHeader';
import { useClients } from '../../hooks/useClients';

export function ClientListPage() {
  const clientsQuery = useClients();
  const clients = clientsQuery.data ?? [];

  return (
    <div>
      <PageHeader title="Clients" description="Client balances and history are now connected to the API layer." />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
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
