import { StatCard } from '../components/dashboard/StatCard';
import { ButtonLink } from '../components/shared/ButtonLink';
import { PageHeader } from '../components/shared/PageHeader';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const dashboardQuery = useDashboard();
  const dashboard = dashboardQuery.data;
  const alertDestination = (type: string) => {
    if (type === 'anomaly') {
      return '/expenses/analytics';
    }

    return '/invoices';
  };

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Financial health at a glance"
        description="Stay on top of cash flow, overdue invoices, and unusual spend without leaving the dashboard."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <ButtonLink to="/cashflow" tone="secondary">
                View cash flow
              </ButtonLink>
              <ButtonLink to="/expenses/analytics" tone="secondary">
                Expense analytics
              </ButtonLink>
            </div>
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
      {dashboard ? (
        <section style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <strong>Cash flow snapshot</strong>
              <ButtonLink to="/cashflow" tone="secondary">
                Expand
              </ButtonLink>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
              {dashboard.cashFlow.map((point) => (
                <div
                  key={point.period}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr repeat(3, minmax(0, 110px))',
                    gap: '0.75rem',
                    alignItems: 'center',
                    padding: '0.85rem 0.95rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.9rem',
                  }}
                >
                  <strong>{point.period}</strong>
                  <span style={{ color: '#0f766e' }}>In ${point.inflow.toFixed(2)}</span>
                  <span style={{ color: '#b45309' }}>Out ${point.outflow.toFixed(2)}</span>
                  <span style={{ color: point.net >= 0 ? '#166534' : '#b91c1c', fontWeight: 700 }}>
                    Net ${point.net.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <strong>Alerts feed</strong>
              <ButtonLink to="/invoices" tone="secondary">
                Review
              </ButtonLink>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
              {dashboard.alerts.length > 0 ? (
                dashboard.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.9rem',
                      padding: '0.9rem',
                      background: alert.type === 'anomaly' ? '#fff7ed' : '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                      <strong>{alert.title}</strong>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: alert.type === 'anomaly' ? '#c2410c' : '#475569',
                        }}
                      >
                        {alert.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p style={{ margin: '0.35rem 0 0', color: '#475569' }}>{alert.description}</p>
                    {alert.actionLabel ? (
                      <div style={{ marginTop: '0.75rem' }}>
                        <ButtonLink to={alertDestination(alert.type)} tone="secondary">
                          {alert.actionLabel}
                        </ButtonLink>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, color: '#64748b' }}>No alerts right now. That is the good kind of quiet.</p>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
