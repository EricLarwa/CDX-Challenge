import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_MONTH, DEFAULT_REPORT_TO } from '../../lib/report-filters';

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

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function ReportDetailPage() {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get('from') ?? DEFAULT_REPORT_FROM;
  const to = searchParams.get('to') ?? DEFAULT_REPORT_TO;
  const month = searchParams.get('month') ?? DEFAULT_REPORT_MONTH;
  const pnlQuery = useProfitAndLoss({ from, to });
  const agingQuery = useArAgingReport();
  const monthlySummaryQuery = useMonthlySummary(month);

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
            <button
              type="button"
              onClick={() => {
                if (type === 'pnl') {
                  downloadTextFile(
                    `profit-loss-${from}-to-${to}.csv`,
                    `metric,value\nrevenue,${pnlQuery.data?.revenue ?? '0.00'}\nexpenses,${pnlQuery.data?.expenses ?? '0.00'}\nprofit,${pnlQuery.data?.profit ?? '0.00'}\n`,
                    'text/csv',
                  );
                  return;
                }

                if (type === 'ar-aging') {
                  downloadTextFile(
                    'ar-aging.csv',
                    `bucket,amount,invoiceCount\n${(agingQuery.data ?? []).map((bucket) => `${bucket.bucket},${bucket.amount},${bucket.invoiceCount}`).join('\n')}\n`,
                    'text/csv',
                  );
                  return;
                }

                downloadTextFile(
                  `monthly-summary-${month}.csv`,
                  `metric,value\nyear,${monthlySummaryQuery.data?.year ?? ''}\nmonth,${monthlySummaryQuery.data?.month ?? ''}\nrevenue,${monthlySummaryQuery.data?.revenue ?? '0.00'}\nexpenses,${monthlySummaryQuery.data?.expenses ?? '0.00'}\nprofit,${monthlySummaryQuery.data?.profit ?? '0.00'}\ntopClient,${monthlySummaryQuery.data?.topClient ?? ''}\ntopExpenseCategory,${monthlySummaryQuery.data?.topExpenseCategory ?? ''}\n`,
                  'text/csv',
                );
              }}
              style={{ padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1px solid #cbd5e1', background: 'white' }}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              style={{ padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1px solid #cbd5e1', background: 'white' }}
            >
              Print / Save PDF
            </button>
          </div>
        }
      />

      {type === 'pnl' ? (
        <ReportRangeControls
          from={from}
          to={to}
          onFromChange={(value) => setSearchParams({ from: value, to })}
          onToChange={(value) => setSearchParams({ from, to: value })}
        />
      ) : null}

      {type !== 'pnl' && type !== 'ar-aging' ? (
        <div
          style={{
            display: 'grid',
            gap: '0.35rem',
            padding: '1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            width: 'min(240px, 100%)',
          }}
        >
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>Month</span>
          <input
            type="month"
            value={month}
            onChange={(event) => setSearchParams({ month: event.target.value })}
            style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
          />
        </div>
      ) : null}

      {type === 'pnl' ? (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          {pnlQuery.isLoading ? <LoadingCard label="Loading P&L report..." /> : null}
          <DetailCard label="Revenue" value={currency.format(Number(pnlQuery.data?.revenue ?? 0))} />
          <DetailCard label="Expenses" value={currency.format(Number(pnlQuery.data?.expenses ?? 0))} />
          <DetailCard label="Profit" value={currency.format(Number(pnlQuery.data?.profit ?? 0))} />
        </section>
      ) : null}

      {type === 'ar-aging' ? (
        <section style={{ display: 'grid', gap: '0.75rem' }}>
          {agingQuery.isLoading ? <LoadingCard label="Loading AR aging..." /> : null}
          {agingQuery.data?.length ? agingQuery.data.map((bucket) => (
            <div key={bucket.bucket} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{bucket.bucket}</strong>
                <span>{currency.format(Number(bucket.amount))}</span>
              </div>
              <div style={{ marginTop: '0.35rem', color: '#64748b' }}>{bucket.invoiceCount} invoices in this bucket</div>
            </div>
          )) : !agingQuery.isLoading ? (
            <EmptyState
              title="No receivables in aging buckets"
              description="Once unpaid invoices accumulate, they will be grouped here by age."
              actions={<ButtonLink to="/invoices">Review invoices</ButtonLink>}
            />
          ) : null}
        </section>
      ) : null}

      {type !== 'pnl' && type !== 'ar-aging' ? (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          {monthlySummaryQuery.isLoading ? <LoadingCard label="Loading monthly summary..." /> : null}
          <DetailCard label="Period" value={`${monthlySummaryQuery.data?.year ?? '...'}-${String(monthlySummaryQuery.data?.month ?? '').padStart(2, '0')}`} />
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
