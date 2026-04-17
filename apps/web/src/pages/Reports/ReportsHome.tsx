import { useSearchParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { PageHeader } from '../../components/shared/PageHeader';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_MONTH, DEFAULT_REPORT_TO } from '../../lib/report-filters';

export function ReportsHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get('from') ?? DEFAULT_REPORT_FROM;
  const to = searchParams.get('to') ?? DEFAULT_REPORT_TO;
  const month = searchParams.get('month') ?? DEFAULT_REPORT_MONTH;
  const pnlQuery = useProfitAndLoss({ from, to });
  const agingQuery = useArAgingReport();
  const summaryQuery = useMonthlySummary(month);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title="Reports"
        description="P&L, AR aging, and monthly summary are now hooked into live report endpoints."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to={`/reports/pnl?from=${from}&to=${to}`}>Open P&L</ButtonLink>
            <ButtonLink to="/reports/ar-aging" tone="secondary">
              Open AR aging
            </ButtonLink>
            <ButtonLink to={`/reports/monthly?month=${month}`} tone="secondary">
              Monthly summary
            </ButtonLink>
          </div>
        }
      />
      <ReportRangeControls
        from={from}
        to={to}
        onFromChange={(value) => setSearchParams({ from: value, to, month })}
        onToChange={(value) => setSearchParams({ from, to: value, month })}
      />
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
        <span style={{ color: '#475569', fontSize: '0.9rem' }}>Monthly summary period</span>
        <input
          type="month"
          value={month}
          onChange={(event) => setSearchParams({ from, to, month: event.target.value })}
          style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>P&L</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            Revenue ${pnlQuery.data?.revenue ?? '...'} · Expenses ${pnlQuery.data?.expenses ?? '...'} · Profit ${pnlQuery.data?.profit ?? '...'}
          </div>
          <div style={{ marginTop: '0.9rem' }}>
            <ButtonLink to={`/reports/pnl?from=${from}&to=${to}`} tone="secondary">
              View report
            </ButtonLink>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>Monthly summary</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            Top client {summaryQuery.data?.topClient ?? '...'} · Top category {summaryQuery.data?.topExpenseCategory ?? '...'}
          </div>
          <div style={{ marginTop: '0.9rem' }}>
            <ButtonLink to={`/reports/monthly?month=${month}`} tone="secondary">
              View report
            </ButtonLink>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>AR aging</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            {agingQuery.data?.map((bucket) => `${bucket.bucket}: $${bucket.amount}`).join(' · ') ?? '...'}
          </div>
          <div style={{ marginTop: '0.9rem' }}>
            <ButtonLink to="/reports/ar-aging" tone="secondary">
              View report
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
