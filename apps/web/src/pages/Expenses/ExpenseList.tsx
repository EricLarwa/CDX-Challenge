import { Link } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { useExpenses } from '../../hooks/useExpenses';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ExpenseListPage() {
  const expensesQuery = useExpenses();
  const expenses = expensesQuery.data?.items ?? [];
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Expense data is now flowing through the shared contract into the UI."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/expenses/new">Log expense</ButtonLink>
            <ButtonLink to="/expenses/analytics" tone="secondary">
              View analytics
            </ButtonLink>
          </div>
        }
      />
      <div style={{ marginBottom: '1rem', color: '#475569' }}>Tracked spend in this view: {currency.format(total)}</div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {expensesQuery.isLoading ? <LoadingCard label="Loading expenses..." /> : null}
        {!expensesQuery.isLoading && expenses.length === 0 ? (
          <EmptyState
            title="No expenses logged yet"
            description="Start with one manual expense and we will use that to power analytics, anomaly checks, and reports."
            actions={
              <>
                <ButtonLink to="/expenses/new">Log expense</ButtonLink>
                <ButtonLink to="/expenses/analytics" tone="secondary">
                  View analytics
                </ButtonLink>
              </>
            }
          />
        ) : null}
        {expenses.map((expense) => (
          <div
            key={expense.id}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <strong>{expense.description}</strong>
              <span>{currency.format(Number(expense.amount))}</span>
            </div>
            <div style={{ color: '#64748b', marginTop: '0.4rem' }}>
              {expense.category} · {new Date(expense.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/reports" style={{ color: '#312e81', fontWeight: 700, textDecoration: 'none' }}>
          Open reports to compare expense impact against revenue
        </Link>
      </div>
    </div>
  );
}
