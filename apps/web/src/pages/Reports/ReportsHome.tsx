import { useSearchParams } from 'react-router-dom';

import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';
import { downloadCsv } from '../../lib/export';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_MONTH, DEFAULT_REPORT_TO } from '../../lib/report-filters';

export function ReportsHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get('from') ?? DEFAULT_REPORT_FROM;
  const to = searchParams.get('to') ?? DEFAULT_REPORT_TO;
  const month = searchParams.get('month') ?? DEFAULT_REPORT_MONTH;
  const pnlQuery = useProfitAndLoss({ from, to });
  const agingQuery = useArAgingReport();
  const summaryQuery = useMonthlySummary(month);
  const { formatCurrency } = useCurrencyFormatter();
  const hasActiveFilters = from !== DEFAULT_REPORT_FROM || to !== DEFAULT_REPORT_TO || month !== DEFAULT_REPORT_MONTH;

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Reports"
        description="P&L, AR aging, and monthly summary are now hooked into live report endpoints."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-reports-overview.csv',
                  ['Report', 'Summary'],
                  [
                    [
                      'P&L',
                      `Revenue ${pnlQuery.data ? formatCurrency(pnlQuery.data.revenue) : '...'} | Expenses ${pnlQuery.data ? formatCurrency(pnlQuery.data.expenses) : '...'} | Profit ${pnlQuery.data ? formatCurrency(pnlQuery.data.profit) : '...'}`,
                    ],
                    [
                      'Monthly Summary',
                      `Top client ${summaryQuery.data?.topClient ?? '...'} | Top category ${summaryQuery.data?.topExpenseCategory ?? '...'}`,
                    ],
                    [
                      'AR Aging',
                      agingQuery.data?.map((bucket) => `${bucket.bucket}: ${bucket.amount}`).join(' | ') ?? '...',
                    ],
                  ],
                )
              }
            >
              Export overview
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            {hasActiveFilters ? (
              <Button
                data-testid="reports-reset-filters"
                type="button"
                variant="secondary"
                onClick={() => setSearchParams({ from: DEFAULT_REPORT_FROM, to: DEFAULT_REPORT_TO, month: DEFAULT_REPORT_MONTH })}
              >
                Reset filters
              </Button>
            ) : null}
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
      <Card className="w-full max-w-xs">
        <CardContent className="grid gap-2 p-5">
          <Label htmlFor="reports-month">Monthly summary period</Label>
          <Input id="reports-month" type="month" value={month} onChange={(event) => setSearchParams({ from, to, month: event.target.value })} />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <strong className="text-lg text-slate-900">P&amp;L</strong>
            {pnlQuery.isLoading ? <div className="mt-3"><LoadingCard label="Loading P&L..." /></div> : null}
              <div className="mt-3 text-sm text-slate-500">
              Revenue {pnlQuery.data ? formatCurrency(pnlQuery.data.revenue) : '...'} · Expenses {pnlQuery.data ? formatCurrency(pnlQuery.data.expenses) : '...'} · Profit {pnlQuery.data ? formatCurrency(pnlQuery.data.profit) : '...'}
            </div>
            <div className="mt-4">
              <ButtonLink to={`/reports/pnl?from=${from}&to=${to}`} tone="secondary">
                View report
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <strong className="text-lg text-slate-900">Monthly summary</strong>
            {summaryQuery.isLoading ? <div className="mt-3"><LoadingCard label="Loading summary..." /></div> : null}
            <div className="mt-3 text-sm text-slate-500">
              Top client {summaryQuery.data?.topClient ?? '...'} · Top category {summaryQuery.data?.topExpenseCategory ?? '...'}
            </div>
            <div className="mt-4">
              <ButtonLink to={`/reports/monthly?month=${month}`} tone="secondary">
                View report
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <strong className="text-lg text-slate-900">AR aging</strong>
            {agingQuery.isLoading ? <div className="mt-3"><LoadingCard label="Loading AR aging..." /></div> : null}
            <div className="mt-3 text-sm text-slate-500">
              {agingQuery.data?.map((bucket) => `${bucket.bucket}: ${formatCurrency(bucket.amount)}`).join(' · ') ?? '...'}
            </div>
            <div className="mt-4">
              <ButtonLink to="/reports/ar-aging" tone="secondary">
                View report
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
