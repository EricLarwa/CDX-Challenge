import { PageHeader } from '../../components/shared/PageHeader';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';

export function ReportsHomePage() {
  const pnlQuery = useProfitAndLoss();
  const agingQuery = useArAgingReport();
  const summaryQuery = useMonthlySummary();

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader title="Reports" description="P&L, AR aging, and monthly summary are now hooked into live report endpoints." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>P&L</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            Revenue ${pnlQuery.data?.revenue ?? '...'} · Expenses ${pnlQuery.data?.expenses ?? '...'} · Profit ${pnlQuery.data?.profit ?? '...'}
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>Monthly summary</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            Top client {summaryQuery.data?.topClient ?? '...'} · Top category {summaryQuery.data?.topExpenseCategory ?? '...'}
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>AR aging</strong>
          <div style={{ marginTop: '0.6rem', color: '#64748b' }}>
            {agingQuery.data?.map((bucket) => `${bucket.bucket}: $${bucket.amount}`).join(' · ') ?? '...'}
          </div>
        </div>
      </div>
    </div>
  );
}
