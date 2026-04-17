import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const sortOptions = [
  ['due-desc', 'Due date (latest)'],
  ['due-asc', 'Due date (earliest)'],
  ['total-desc', 'Total (highest)'],
  ['total-asc', 'Total (lowest)'],
  ['balance-desc', 'Balance due'],
] as const;

export function InvoiceListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const sort = searchParams.get('sort') ?? 'due-desc';
  const invoicesQuery = useInvoices({ search, status: status || undefined });
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
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        eyebrow="Invoicing"
        title="Invoices"
        description="The list is now wired to the API contract and ready for table polish, filters, and status badges."
        actions={<ButtonLink to="/invoices/new">New invoice</ButtonLink>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Invoices in view</div>
          <strong style={{ fontSize: '1.25rem' }}>{sortedInvoices.length}</strong>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Outstanding</div>
          <strong style={{ fontSize: '1.25rem' }}>{currency.format(summary.outstanding)}</strong>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Overdue exposure</div>
          <strong style={{ fontSize: '1.25rem' }}>{currency.format(summary.overdue)}</strong>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1.5fr) minmax(180px, 220px) minmax(180px, 220px)',
          gap: '0.75rem',
          padding: '1rem',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
        }}
      >
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>Search invoices</span>
          <input
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
            style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>Status</span>
          <select
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
            style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
          >
            <option value="">All statuses</option>
            {Object.keys(statusTone).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>Sort by</span>
          <select
            value={sort}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              next.set('sort', event.target.value);
              setSearchParams(next);
            }}
            style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
          >
            {sortOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
        {sortedInvoices.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '0.85rem' }}>Invoice</th>
                <th style={{ padding: '0.85rem' }}>Client</th>
                <th style={{ padding: '0.85rem' }}>Status</th>
                <th style={{ padding: '0.85rem' }}>Due</th>
                <th style={{ padding: '0.85rem', textAlign: 'right' }}>Balance</th>
                <th style={{ padding: '0.85rem', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.85rem' }}>
                    <Link to={`/invoices/${invoice.id}`} style={{ color: '#312e81', fontWeight: 700, textDecoration: 'none' }}>
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '0.85rem' }}>{invoice.clientName ?? 'Unknown client'}</td>
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
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                    {currency.format(Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)))}
                  </td>
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>{currency.format(Number(invoice.total))}</td>
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Link to={`/invoices/${invoice.id}`} style={{ color: '#312e81', fontWeight: 700, textDecoration: 'none' }}>
                        View
                      </Link>
                      <Link to={`/invoices/${invoice.id}/edit`} style={{ color: '#475569', fontWeight: 700, textDecoration: 'none' }}>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', display: 'grid', gap: '0.75rem' }}>
            <strong>No invoices match this view yet.</strong>
            <div style={{ color: '#64748b' }}>
              Adjust the search or status filter, or create a new invoice to start the workflow.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
              <ButtonLink to="/reports/ar-aging" tone="secondary">
                Review AR aging
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
