import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useExpenses } from '../../hooks/useExpenses';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ExpenseAnalyticsPage() {
  const expensesQuery = useExpenses();
  const expenses = expensesQuery.data?.items ?? [];

  const byCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount);
    return acc;
  }, {});

  const ranked = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title="Expense analytics"
        description="Category totals and spend concentration are now reachable directly from the expenses module."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/expenses">Back to expenses</ButtonLink>
            <ButtonLink to="/reports/pnl" tone="secondary">
              Compare with profit
            </ButtonLink>
          </div>
        }
      />
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
        <strong>Spend by category</strong>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {ranked.length ? (
            ranked.map(([category, amount]) => (
              <div key={category} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{category}</span>
                <div style={{ height: '0.8rem', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.max(8, (amount / ((ranked[0]?.[1] ?? amount) || 1)) * 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    }}
                  />
                </div>
                <strong>{currency.format(amount)}</strong>
              </div>
            ))
          ) : (
            <div style={{ color: '#64748b' }}>No expenses yet. Log an expense to start building analytics.</div>
          )}
        </div>
      </div>
    </div>
  );
}
