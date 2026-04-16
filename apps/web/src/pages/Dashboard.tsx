import { StatCard } from '../components/dashboard/StatCard';
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
      />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <StatCard label="Revenue MTD" value={dashboard ? `$${dashboard.summary.revenueMTD}` : '...'} tone="success" />
        <StatCard label="Expenses MTD" value={dashboard ? `$${dashboard.summary.expensesMTD}` : '...'} />
        <StatCard label="Outstanding" value={dashboard ? `$${dashboard.summary.outstanding}` : '...'} tone="warning" />
        <StatCard label="Health Score" value={dashboard ? `${dashboard.healthScore.score} / 100` : '...'} tone="success" />
      </section>
      {dashboard ? (
        <section style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <strong>Health drivers</strong>
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', color: '#475569' }}>
              {dashboard.healthScore.drivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
