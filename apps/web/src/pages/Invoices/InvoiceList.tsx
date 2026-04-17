import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useInvoices } from '../../hooks/useInvoices';
import { downloadCsv } from '../../lib/export';

const statusTone: Record<string, 'default' | 'warning' | 'info' | 'success' | 'danger'> = {
  DRAFT: 'default',
  SENT: 'warning',
  VIEWED: 'info',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'default',
};

const sortOptions = [
  ['due-desc', 'Due date (latest)'],
  ['due-asc', 'Due date (earliest)'],
  ['total-desc', 'Total (highest)'],
  ['total-asc', 'Total (lowest)'],
  ['balance-desc', 'Balance due'],
] as const;

export function InvoiceListPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const sort = searchParams.get('sort') ?? 'due-desc';
  const { formatCurrency } = useCurrencyFormatter();
  const invoicesQuery = useInvoices({ search, status: status || undefined });
  const hasActiveFilters = Boolean(search || status || sort !== 'due-desc');
  const invoices = useMemo(() => invoicesQuery.data?.items ?? [], [invoicesQuery.data?.items]);

  const sortedInvoices = useMemo(() => {
    const items = [...invoices];

    items.sort((left, right) => {
      const leftDue = new Date(left.dueDate).getTime();
      const rightDue = new Date(right.dueDate).getTime();
      const leftTotal = Number(left.total);
      const rightTotal = Number(right.total);
      const leftBalance = leftTotal - Number(left.amountPaid);
      const rightBalance = rightTotal - Number(right.amountPaid);

      switch (sort) {
        case 'due-asc':
          return leftDue - rightDue;
        case 'total-desc':
          return rightTotal - leftTotal;
        case 'total-asc':
          return leftTotal - rightTotal;
        case 'balance-desc':
          return rightBalance - leftBalance;
        default:
          return rightDue - leftDue;
      }
    });

    return items;
  }, [invoices, sort]);

  const summary = useMemo(() => {
    return sortedInvoices.reduce(
      (acc, invoice) => {
        const total = Number(invoice.total);
        const outstanding = Math.max(0, total - Number(invoice.amountPaid));
        acc.total += total;
        acc.outstanding += outstanding;
        if (invoice.status === 'OVERDUE') {
          acc.overdue += outstanding;
        }
        return acc;
      },
      { total: 0, outstanding: 0, overdue: 0 },
    );
  }, [sortedInvoices]);

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Invoicing"
        title="Invoices"
        description="The list is now wired to the API contract and ready for table polish, filters, and status badges."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-invoices.csv',
                  ['Invoice', 'Client', 'Status', 'Due Date', 'Balance', 'Total'],
                  sortedInvoices.map((invoice) => [
                    invoice.invoiceNumber,
                    invoice.clientName ?? 'Unknown client',
                    invoice.status,
                    new Date(invoice.dueDate).toLocaleDateString(),
                    Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)).toFixed(2),
                    Number(invoice.total).toFixed(2),
                  ]),
                )
              }
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <ButtonLink to="/invoices/new">New invoice</ButtonLink>
          </div>
        }
      />
      {typeof location.state === 'object' && location.state && 'notice' in location.state ? (
        <FeedbackBanner tone="success" message={String(location.state.notice)} />
      ) : null}
      {invoicesQuery.isError ? (
        <FeedbackBanner
          tone="error"
          message="We couldn't load invoices for this view. Try refreshing, or open a client to verify the record still exists."
        />
      ) : null}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Invoices in view</div><strong className="mt-2 block text-2xl font-semibold text-slate-950">{sortedInvoices.length}</strong></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Outstanding</div><strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(summary.outstanding)}</strong></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-slate-500">Overdue exposure</div><strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(summary.overdue)}</strong></CardContent></Card>
      </div>
      <Card>
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[minmax(220px,1.5fr)_minmax(180px,220px)_minmax(180px,220px)]">
        <Label>
          <span>Search invoices</span>
          <Input
            value={search}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) {
                next.set('search', event.target.value);
              } else {
                next.delete('search');
              }
              setSearchParams(next);
            }}
            placeholder="Invoice number or client"
          />
        </Label>
        <Label>
          <span>Status</span>
          <Select
            value={status}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) {
                next.set('status', event.target.value);
              } else {
                next.delete('status');
              }
              setSearchParams(next);
            }}
          >
            <option value="">All statuses</option>
            {Object.keys(statusTone).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          <span>Sort by</span>
          <Select
            value={sort}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              next.set('sort', event.target.value);
              setSearchParams(next);
            }}
          >
            {sortOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Label>
        {hasActiveFilters ? (
          <div className="flex items-end">
            <Button
              data-testid="invoice-clear-filters"
              type="button"
              variant="secondary"
              onClick={() => setSearchParams({})}
            >
              Clear filters
            </Button>
          </div>
        ) : null}
        </CardContent>
      </Card>
      {invoicesQuery.isLoading ? <LoadingCard label="Loading invoices..." /> : null}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
        {sortedInvoices.length ? (
          <>
            <div className="grid gap-3 p-4 md:hidden">
              {sortedInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-slate-200 shadow-none">
                  <CardContent className="grid gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid gap-1">
                        <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-700 no-underline">
                          {invoice.invoiceNumber}
                        </Link>
                        <span className="text-sm text-slate-500">{invoice.clientName ?? 'Unknown client'}</span>
                      </div>
                      <Badge variant={statusTone[invoice.status]}>{invoice.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="grid gap-1">
                        <span className="text-slate-500">Due</span>
                        <span className="font-medium text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-slate-500">Balance</span>
                        <span className="font-medium text-slate-900">
                          {formatCurrency(Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)))}
                        </span>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-slate-500">Total</span>
                        <span className="font-medium text-slate-900">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-700 no-underline">
                        View
                      </Link>
                      <Link to={`/invoices/${invoice.id}/edit`} className="font-semibold text-slate-500 no-underline">
                        Edit
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Invoice</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Client</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Due</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Balance</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Total</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-t border-slate-200">
                      <td className="px-4 py-4">
                        <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-700 no-underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{invoice.clientName ?? 'Unknown client'}</td>
                      <td className="px-4 py-4">
                        <Badge variant={statusTone[invoice.status]}>{invoice.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)))}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-slate-900">{formatCurrency(invoice.total)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link to={`/invoices/${invoice.id}`} className="font-semibold text-blue-700 no-underline">
                            View
                          </Link>
                          <Link to={`/invoices/${invoice.id}/edit`} className="font-semibold text-slate-500 no-underline">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="grid gap-3 p-8">
            <strong>No invoices match this view yet.</strong>
            <div className="text-sm text-slate-500">
              Adjust the search or status filter, or create a new invoice to start the workflow.
            </div>
            <div className="flex gap-3">
              <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
              <ButtonLink to="/reports/ar-aging" tone="secondary">
                Review AR aging
              </ButtonLink>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
