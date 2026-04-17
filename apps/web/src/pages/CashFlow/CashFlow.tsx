import { useSearchParams } from 'react-router-dom';

import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { useCashFlowReport } from '../../hooks/useReports';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_TO } from '../../lib/report-filters';

export function CashFlowPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get('from') ?? DEFAULT_REPORT_FROM;
  const to = searchParams.get('to') ?? DEFAULT_REPORT_TO;
  const cashFlowQuery = useCashFlowReport({ from, to });
  const points = cashFlowQuery.data ?? [];

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Cash flow timeline"
        description="Projected inflows and outflows are now populated from the reports API."
        actions={
          <div className="flex flex-wrap gap-3">
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
      {cashFlowQuery.isError ? (
        <FeedbackBanner tone="error" message="Cash flow data failed to load for this date range. Try adjusting the range and retrying." />
      ) : null}
      <div className="grid gap-3">
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
          <Card key={point.period}>
            <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_repeat(3,minmax(0,140px))] md:items-center">
              <strong className="text-slate-900">{point.period}</strong>
              <div className="text-sm text-teal-700">Inflow ${point.inflow.toFixed(2)}</div>
              <div className="text-sm text-amber-700">Outflow ${point.outflow.toFixed(2)}</div>
              <div className={`text-sm font-semibold ${point.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                Net ${point.net.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
