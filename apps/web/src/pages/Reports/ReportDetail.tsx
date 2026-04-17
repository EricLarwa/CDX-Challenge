import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { ReportRangeControls } from '../../components/reports/ReportRangeControls';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useArAgingReport, useMonthlySummary, useProfitAndLoss } from '../../hooks/useReports';
import { DEFAULT_REPORT_FROM, DEFAULT_REPORT_MONTH, DEFAULT_REPORT_TO } from '../../lib/report-filters';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function DetailCard(props: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-slate-500">{props.label}</div>
        <strong className="mt-1 block text-xl font-semibold text-slate-950">{props.value}</strong>
      </CardContent>
    </Card>
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
  const activeQuery = type === 'pnl' ? pnlQuery : type === 'ar-aging' ? agingQuery : monthlySummaryQuery;

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
    <div className="grid gap-4">
      <PageHeader
        title={view.title}
        description={view.description}
        actions={
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/reports" tone="secondary">
              Back to reports
            </ButtonLink>
            <ButtonLink to="/cashflow">Open cash flow</ButtonLink>
            <Button
              type="button"
              variant="secondary"
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
            >
              Export CSV
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </Button>
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
        <Card className="w-full max-w-60">
          <CardContent className="grid gap-2 p-4">
            <Label htmlFor="report-month">Month</Label>
            <Input
              id="report-month"
              type="month"
              value={month}
              onChange={(event) => setSearchParams({ month: event.target.value })}
            />
          </CardContent>
        </Card>
      ) : null}

      {activeQuery.isError ? (
        <FeedbackBanner
          tone="error"
          message="This report failed to load. Check the selected date range or refresh after the API has restarted."
        />
      ) : null}

      {type === 'pnl' ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pnlQuery.isLoading ? <LoadingCard label="Loading P&L report..." /> : null}
          <DetailCard label="Revenue" value={currency.format(Number(pnlQuery.data?.revenue ?? 0))} />
          <DetailCard label="Expenses" value={currency.format(Number(pnlQuery.data?.expenses ?? 0))} />
          <DetailCard label="Profit" value={currency.format(Number(pnlQuery.data?.profit ?? 0))} />
        </section>
      ) : null}

      {type === 'ar-aging' ? (
        <section className="grid gap-3">
          {agingQuery.isLoading ? <LoadingCard label="Loading AR aging..." /> : null}
          {agingQuery.data?.length ? agingQuery.data.map((bucket) => (
            <Card key={bucket.bucket}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <strong className="text-slate-950">{bucket.bucket}</strong>
                  <span className="font-medium text-slate-700">{currency.format(Number(bucket.amount))}</span>
                </div>
                <div className="mt-1 text-sm text-slate-500">{bucket.invoiceCount} invoices in this bucket</div>
              </CardContent>
            </Card>
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
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
