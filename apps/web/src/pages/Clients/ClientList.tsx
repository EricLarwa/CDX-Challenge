import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useClients } from '../../hooks/useClients';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { downloadCsv } from '../../lib/export';

export function ClientListPage() {
  const clientsQuery = useClients();
  const { formatCurrency } = useCurrencyFormatter();
  const clients = useMemo(() => clientsQuery.data ?? [], [clientsQuery.data]);
  const [search, setSearch] = useState('');
  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(normalizedSearch) ||
        (client.email ?? '').toLowerCase().includes(normalizedSearch)
      );
    });
  }, [clients, search]);
  const totalOutstanding = filteredClients.reduce((sum, client) => sum + Number(client.outstanding), 0);
  const totalInvoiced = filteredClients.reduce((sum, client) => sum + Number(client.totalInvoiced), 0);

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Clients"
        description="Client balances and history are now connected to the API layer."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-clients.csv',
                  ['Client', 'Email', 'Payment Terms', 'Outstanding', 'Total Invoiced'],
                  filteredClients.map((client) => [
                    client.name,
                    client.email ?? '',
                    client.paymentTerms,
                    client.outstanding,
                    client.totalInvoiced,
                  ]),
                )
              }
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <ButtonLink to="/clients/new">New client</ButtonLink>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Clients in view</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{filteredClients.length}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Outstanding balance</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(totalOutstanding)}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Total invoiced</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(totalInvoiced)}</strong>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-5">
          <Label>
            <span>Search clients</span>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Client name or email"
            />
          </Label>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {clientsQuery.isLoading ? <LoadingCard label="Loading clients..." /> : null}
        {!clientsQuery.isLoading && filteredClients.length === 0 ? (
          <EmptyState
            title={clients.length === 0 ? 'No clients yet' : 'No clients match this search'}
            description={
              clients.length === 0
                ? 'Once invoices start going out, this hub will show balances, terms, and payment history.'
                : 'Try a different name or email search to pull the right client back into view.'
            }
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
        {filteredClients.map((client) => (
          <Link key={client.id} to={`/clients/${client.id}`} className="text-inherit no-underline">
            <Card className="transition-colors hover:border-slate-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <strong className="text-slate-950">{client.name}</strong>
                  <span className="font-medium text-slate-700">{formatCurrency(client.outstanding)} outstanding</span>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Total invoiced {formatCurrency(client.totalInvoiced)} · Terms {client.paymentTerms} days
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="font-medium text-indigo-700">Open client</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-medium text-slate-600">Create invoice from profile</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
