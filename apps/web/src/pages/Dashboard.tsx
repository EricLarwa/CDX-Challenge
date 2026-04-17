import { StatCard } from '../components/dashboard/StatCard';
import { ButtonLink } from '../components/shared/ButtonLink';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingCard } from '../components/shared/LoadingCard';
import { MetricGridSkeleton } from '../components/shared/MetricGridSkeleton';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';
import { useDashboard } from '../hooks/useDashboard';
import { downloadCsv } from '../lib/export';

export function DashboardPage() {
  const dashboardQuery = useDashboard();
  const dashboard = dashboardQuery.data;
  const { formatCurrency } = useCurrencyFormatter();
  const alertDestination = (type: string) => {
    if (type === 'anomaly') {
      return '/expenses/analytics';
    }

    return '/invoices';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Financial health at a glance"
        description="Stay on top of cash flow, overdue invoices, and unusual spend without leaving the dashboard."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-dashboard-snapshot.csv',
                  ['Metric', 'Value'],
                  dashboard
                    ? [
                        ['Revenue MTD', dashboard.summary.revenueMTD],
                        ['Expenses MTD', dashboard.summary.expensesMTD],
                        ['Outstanding', dashboard.summary.outstanding],
                        ['Overdue', dashboard.summary.overdue],
                        ['Health Score', dashboard.healthScore.score],
                      ]
                    : [],
                )
              }
              disabled={!dashboard}
            >
              Export snapshot
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <ButtonLink to="/invoices/new">New invoice</ButtonLink>
            <ButtonLink to="/expenses/new" tone="secondary">
              Log expense
            </ButtonLink>
            <ButtonLink to="/reports" tone="secondary">
              Open reports
            </ButtonLink>
          </div>
        }
      />
      {dashboardQuery.isLoading ? <MetricGridSkeleton cards={4} /> : null}
      {!dashboardQuery.isLoading ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div data-testid="dashboard-revenue">
            <StatCard label="Revenue MTD" value={dashboard ? formatCurrency(dashboard.summary.revenueMTD) : '...'} tone="success" />
          </div>
          <div data-testid="dashboard-expenses">
            <StatCard label="Expenses MTD" value={dashboard ? formatCurrency(dashboard.summary.expensesMTD) : '...'} />
          </div>
          <div data-testid="dashboard-outstanding">
            <StatCard label="Outstanding" value={dashboard ? formatCurrency(dashboard.summary.outstanding) : '...'} tone="warning" />
          </div>
          <div data-testid="dashboard-health">
            <StatCard label="Health Score" value={dashboard ? `${dashboard.healthScore.score} / 100` : '...'} tone="success" />
          </div>
        </section>
      ) : null}
      {dashboardQuery.isLoading ? <LoadingCard label="Loading dashboard sections..." /> : null}
      {!dashboardQuery.isLoading && !dashboard ? (
        <EmptyState
          title="Dashboard data is not ready yet"
          description="Once invoices and expenses are flowing, this screen will turn into the financial control center."
          actions={
            <>
              <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
              <ButtonLink to="/expenses/new" tone="secondary">
                Log expense
              </ButtonLink>
            </>
          }
        />
      ) : null}
      {dashboard ? (
        <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardContent className="p-5">
              <strong className="text-lg text-slate-900">Health drivers</strong>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {dashboard.healthScore.drivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink to="/cashflow" tone="secondary">
                  View cash flow
                </ButtonLink>
                <ButtonLink to="/expenses/analytics" tone="secondary">
                  Expense analytics
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <strong className="text-lg text-slate-900">Quick actions</strong>
              <ButtonLink to="/invoices">Review invoices</ButtonLink>
              <ButtonLink to="/cashflow" tone="secondary">
                Open cash flow
              </ButtonLink>
              <ButtonLink to="/reports" tone="secondary">
                View reports
              </ButtonLink>
            </CardContent>
          </Card>
        </section>
      ) : null}
      {dashboard ? (
        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <strong className="text-lg text-slate-900">Cash flow snapshot</strong>
                <ButtonLink to="/cashflow" tone="secondary">
                  Expand
                </ButtonLink>
              </div>
              <div className="mt-4 grid gap-3">
                {dashboard.cashFlow.map((point) => (
                  <div
                    key={point.period}
                    className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 sm:grid-cols-2 md:grid-cols-[1fr_repeat(3,minmax(0,110px))] md:items-center md:gap-3"
                  >
                    <strong className="text-slate-900">{point.period}</strong>
                    <span className="text-sm text-teal-700">In {formatCurrency(point.inflow)}</span>
                    <span className="text-sm text-amber-700">Out {formatCurrency(point.outflow)}</span>
                    <span className={`text-sm font-semibold ${point.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      Net {formatCurrency(point.net)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <strong className="text-lg text-slate-900">Alerts feed</strong>
                <ButtonLink to="/invoices" tone="secondary">
                  Review
                </ButtonLink>
              </div>
              <div className="mt-4 grid gap-3">
                {dashboard.alerts.length > 0 ? (
                  dashboard.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-2xl border p-4 ${alert.type === 'anomaly' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <strong className="text-slate-900">{alert.title}</strong>
                        <span className={`text-[0.7rem] uppercase tracking-[0.16em] ${alert.type === 'anomaly' ? 'text-amber-700' : 'text-slate-500'}`}>
                          {alert.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
                      {alert.actionLabel ? (
                        <div className="mt-3">
                          <ButtonLink to={alertDestination(alert.type)} tone="secondary">
                            {alert.actionLabel}
                          </ButtonLink>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No alerts right now. That is the good kind of quiet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
