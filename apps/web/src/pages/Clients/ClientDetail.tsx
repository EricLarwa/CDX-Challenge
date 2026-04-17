import { Link, useParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { useClientDetail } from '../../hooks/useClients';

const statusTone: Record<string, 'default' | 'warning' | 'info' | 'success' | 'danger'> = {
  DRAFT: 'default',
  SENT: 'warning',
  VIEWED: 'info',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'default',
};

export function ClientDetailPage() {
  const { id } = useParams();
  const clientQuery = useClientDetail(id);
  const client = clientQuery.data;

  return (
    <div className="grid gap-4">
      <PageHeader
        title={client?.name ?? 'Client detail'}
        description={client ? `Payment terms: ${client.paymentTerms} days` : 'Invoice history and payment behavior render here.'}
        actions={<ButtonLink to="/clients">Back to clients</ButtonLink>}
      />
      {clientQuery.isLoading ? <LoadingCard label="Loading client history..." /> : null}
      {client ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="grid gap-3">
            {client.invoices.length ? (
              client.invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="grid gap-1">
                        <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-700 no-underline">
                          {invoice.invoiceNumber}
                        </Link>
                        <div className="text-sm text-slate-500">
                          Total ${invoice.total} · Paid ${invoice.amountPaid}
                        </div>
                      </div>
                      <Badge variant={statusTone[invoice.status] ?? 'default'}>{invoice.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState
                title="No invoices for this client yet"
                description="The relationship is set up, but there is no invoice history to review just yet."
                actions={<ButtonLink to="/invoices/new">Create invoice</ButtonLink>}
              />
            )}
          </div>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <strong className="text-lg text-slate-900">Client snapshot</strong>
              <div className="text-sm text-slate-600">Email: {client.email ?? 'No email on file'}</div>
              <div className="text-sm text-slate-600">Payment terms: {client.paymentTerms} days</div>
              <div className="text-sm text-slate-600">Invoices: {client.invoices.length}</div>
              {client.notes ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{client.notes}</div> : null}
              <div className="grid gap-3">
                <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
                <ButtonLink to="/reports/ar-aging" tone="secondary">
                  Review receivables
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
