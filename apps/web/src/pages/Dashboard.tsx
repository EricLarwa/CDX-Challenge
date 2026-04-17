import { StatCard } from '../components/dashboard/StatCard';
import { ButtonLink } from '../components/shared/ButtonLink';
import { PageHeader } from '../components/shared/PageHeader';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const dashboardQuery = useDashboard();
  const dashboard = dashboardQuery.data;

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Financial health at a glance"
        description="The dashboard now consumes the API shape and is ready for charts, alerts, and deeper KPI components."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/invoices/new">New invoice</ButtonLink>
            <ButtonLink to="/expenses/new" tone="secondary">
              Log expense
            </ButtonLink>
          </div>
        }
      />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <StatCard label="Revenue MTD" value={dashboard ? `$${dashboard.summary.revenueMTD}` : '...'} tone="success" />
        <StatCard label="Expenses MTD" value={dashboard ? `$${dashboard.summary.expensesMTD}` : '...'} />
        <StatCard label="Outstanding" value={dashboard ? `$${dashboard.summary.outstanding}` : '...'} tone="warning" />
        <StatCard label="Health Score" value={dashboard ? `${dashboard.healthScore.score} / 100` : '...'} tone="success" />
      </section>
      {dashboard ? (
        <section style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <strong>Health drivers</strong>
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', color: '#475569' }}>
              {dashboard.healthScore.drivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
            <strong>Quick actions</strong>
            <ButtonLink to="/invoices">Review invoices</ButtonLink>
            <ButtonLink to="/cashflow" tone="secondary">
              Open cash flow
            </ButtonLink>
            <ButtonLink to="/reports" tone="secondary">
              View reports
            </ButtonLink>
          </div>
        </section>
      ) : null}
    </div>
  );
}
