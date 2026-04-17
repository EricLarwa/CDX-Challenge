import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { ListSkeleton } from '../../components/shared/ListSkeleton';
import { MetricGridSkeleton } from '../../components/shared/MetricGridSkeleton';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { useClientDetail } from '../../hooks/useClients';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

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
  const location = useLocation();
  const clientQuery = useClientDetail(id);
  const client = clientQuery.data;
  const { formatCurrency } = useCurrencyFormatter();
  const metrics = useMemo(() => {
    if (!client) {
      return {
        totalInvoiced: 0,
        totalPaid: 0,
        outstanding: 0,
        averagePaymentDelay: null as number | null,
      };
    }

    const totalInvoiced = client.invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const totalPaid = client.invoices.reduce((sum, invoice) => sum + Number(invoice.amountPaid), 0);
    const outstanding = Math.max(0, totalInvoiced - totalPaid);
    const paidInvoices = client.invoices.filter(
      (invoice) => invoice.payments.length > 0 && Number(invoice.amountPaid) >= Number(invoice.total),
    );
    const averagePaymentDelay = paidInvoices.length
      ? Math.round(
          paidInvoices.reduce((sum, invoice) => {
            const lastPayment = invoice.payments.reduce((latest, payment) => {
              return new Date(payment.paidAt).getTime() > new Date(latest.paidAt).getTime() ? payment : latest;
            });
            const dueDate = new Date(invoice.dueDate).getTime();
            const paidDate = new Date(lastPayment.paidAt).getTime();
            return sum + Math.round((paidDate - dueDate) / (1000 * 60 * 60 * 24));
          }, 0) / paidInvoices.length,
        )
      : null;

    return {
      totalInvoiced,
      totalPaid,
      outstanding,
      averagePaymentDelay,
    };
  }, [client]);

  return (
    <div className="grid gap-4">
      <PageHeader
        title={client?.name ?? 'Client detail'}
        description={client ? `Payment terms: ${client.paymentTerms} days` : 'Invoice history and payment behavior render here.'}
        actions={<ButtonLink to="/clients">Back to clients</ButtonLink>}
      />
      {typeof location.state === 'object' && location.state && 'notice' in location.state ? (
        <FeedbackBanner tone="success" message={String(location.state.notice)} />
      ) : null}
      {clientQuery.isLoading ? (
        <>
          <MetricGridSkeleton cards={4} />
          <ListSkeleton rows={3} />
        </>
      ) : null}
      {client ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-slate-500">Total invoiced</div>
                <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(metrics.totalInvoiced)}</strong>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-slate-500">Total paid</div>
                <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(metrics.totalPaid)}</strong>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-slate-500">Outstanding</div>
                <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(metrics.outstanding)}</strong>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-slate-500">Average payment delay</div>
                <strong className="mt-2 block text-2xl font-semibold text-slate-950">
                  {metrics.averagePaymentDelay === null ? 'N/A' : `${metrics.averagePaymentDelay}d`}
                </strong>
              </CardContent>
            </Card>
          </div>
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
                          Issued {new Date(invoice.issueDate).toLocaleDateString()} · Due {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          Total {formatCurrency(invoice.total)} · Paid {formatCurrency(invoice.amountPaid)}
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
                actions={<ButtonLink to={`/invoices/new?clientId=${client.id}`}>Create invoice</ButtonLink>}
              />
            )}
          </div>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <strong className="text-lg text-slate-900">Client snapshot</strong>
              <div className="text-sm text-slate-600">Email: {client.email ?? 'No email on file'}</div>
              <div className="text-sm text-slate-600">Payment terms: {client.paymentTerms} days</div>
              <div className="text-sm text-slate-600">Invoices: {client.invoices.length}</div>
              <div className="text-sm text-slate-600">Outstanding: {formatCurrency(metrics.outstanding)}</div>
              {client.notes ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{client.notes}</div> : null}
              <div className="grid gap-3">
                <ButtonLink to={`/invoices/new?clientId=${client.id}`}>Create invoice</ButtonLink>
                <ButtonLink to="/reports/ar-aging" tone="secondary">
                  Review receivables
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
      ) : !clientQuery.isLoading ? (
        <EmptyState
          title="We couldn't find this client"
          description="The record may have been removed, or the link may be stale. You can head back to the client hub and keep working from there."
          actions={<ButtonLink to="/clients">Back to clients</ButtonLink>}
        />
      ) : null}
    </div>
  );
}
