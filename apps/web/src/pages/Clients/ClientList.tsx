import { Link } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { useClients } from '../../hooks/useClients';

export function ClientListPage() {
  const clientsQuery = useClients();
  const clients = clientsQuery.data ?? [];

  return (
    <div className="grid gap-4">
      <PageHeader title="Clients" description="Client balances and history are now connected to the API layer." />
      <div className="grid gap-3">
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
            className="text-inherit no-underline"
          >
            <Card className="transition-colors hover:border-slate-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <strong className="text-slate-950">{client.name}</strong>
                  <span className="font-medium text-slate-700">${client.outstanding} outstanding</span>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Total invoiced ${client.totalInvoiced} · Terms {client.paymentTerms} days
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
