import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function DetailCard(props: { label: string; value: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{props.label}</div>
      <strong style={{ display: 'block', marginTop: '0.35rem', fontSize: '1.2rem' }}>{props.value}</strong>
    </div>
  );
}

export function ReportDetailPage() {
  const { type } = useParams();
  const pnlQuery = useProfitAndLoss();
  const agingQuery = useArAgingReport();
  const monthlySummaryQuery = useMonthlySummary();

  const view = useMemo(() => {
    if (type === 'pnl') {
      return {
        title: 'Profit & loss',
        description: 'Revenue versus expenses for the active reporting window.',
      };
    }

    if (type === 'ar-aging') {
      return {
        title: 'Accounts receivable aging',
        description: 'Outstanding invoices grouped by how long they have been unpaid.',
      };
    }

    return {
      title: 'Monthly summary',
      description: 'A one-screen snapshot of how the business performed this month.',
    };
  }, [type]);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title={view.title}
        description={view.description}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/reports" tone="secondary">
              Back to reports
            </ButtonLink>
            <ButtonLink to="/cashflow">Open cash flow</ButtonLink>
          </div>
        }
      />

      {type === 'pnl' ? (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          <DetailCard label="Revenue" value={currency.format(Number(pnlQuery.data?.revenue ?? 0))} />
          <DetailCard label="Expenses" value={currency.format(Number(pnlQuery.data?.expenses ?? 0))} />
          <DetailCard label="Profit" value={currency.format(Number(pnlQuery.data?.profit ?? 0))} />
        </section>
      ) : null}

      {type === 'ar-aging' ? (
        <section style={{ display: 'grid', gap: '0.75rem' }}>
          {agingQuery.data?.map((bucket) => (
            <div key={bucket.bucket} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{bucket.bucket}</strong>
                <span>{currency.format(Number(bucket.amount))}</span>
              </div>
              <div style={{ marginTop: '0.35rem', color: '#64748b' }}>{bucket.invoiceCount} invoices in this bucket</div>
            </div>
          ))}
        </section>
      ) : null}

      {type !== 'pnl' && type !== 'ar-aging' ? (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <DetailCard label="Revenue" value={currency.format(Number(monthlySummaryQuery.data?.revenue ?? 0))} />
          <DetailCard label="Expenses" value={currency.format(Number(monthlySummaryQuery.data?.expenses ?? 0))} />
          <DetailCard label="Profit" value={currency.format(Number(monthlySummaryQuery.data?.profit ?? 0))} />
          <DetailCard label="Top client" value={monthlySummaryQuery.data?.topClient ?? 'No client data yet'} />
          <DetailCard
            label="Top expense category"
            value={monthlySummaryQuery.data?.topExpenseCategory ?? 'No category data yet'}
          />
        </section>
      ) : null}
    </div>
  );
}
