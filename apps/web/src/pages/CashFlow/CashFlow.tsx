import { useSearchParams } from 'react-router-dom';

import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useCashFlowReport } from '../../hooks/useReports';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_TO } from '../../lib/report-filters';

export function CashFlowPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get('from') ?? DEFAULT_REPORT_FROM;
  const to = searchParams.get('to') ?? DEFAULT_REPORT_TO;
  const cashFlowQuery = useCashFlowReport({ from, to });
  const points = cashFlowQuery.data ?? [];

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title="Cash flow timeline"
        description="Projected inflows and outflows are now populated from the reports API."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/reports" tone="secondary">
              Back to reports
            </ButtonLink>
            <ButtonLink to={`/reports/pnl?from=${from}&to=${to}`}>Compare with P&L</ButtonLink>
          </div>
        }
      />
      <ReportRangeControls
        from={from}
        to={to}
        onFromChange={(value) => setSearchParams({ from: value, to })}
        onToChange={(value) => setSearchParams({ from, to: value })}
      />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {cashFlowQuery.isLoading ? <LoadingCard label="Loading cash flow..." /> : null}
        {!cashFlowQuery.isLoading && points.length === 0 ? (
          <EmptyState
            title="No cash flow points in this window"
            description="Try widening the date range or create invoices and expenses so projected inflows and outflows have something to show."
            actions={
              <>
                <ButtonLink to="/invoices/new">New invoice</ButtonLink>
                <ButtonLink to="/expenses/new" tone="secondary">
                  Log expense
                </ButtonLink>
              </>
            }
          />
        ) : null}
        {points.map((point) => (
          <div key={point.period} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <strong>{point.period}</strong>
            <div style={{ marginTop: '0.4rem', color: '#64748b' }}>
              Inflow ${point.inflow.toFixed(2)} · Outflow ${point.outflow.toFixed(2)} · Net ${point.net.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
