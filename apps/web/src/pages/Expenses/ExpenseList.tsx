import { PageHeader } from '../../components/shared/PageHeader';
import { useExpenses } from '../../hooks/useExpenses';

export function ExpenseListPage() {
  const expensesQuery = useExpenses();
  const expenses = expensesQuery.data?.items ?? [];

  return (
    <div>
      <PageHeader title="Expenses" description="Expense data is now flowing through the shared contract into the UI." />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <strong>{expense.description}</strong>
              <span>${expense.amount}</span>
            </div>
            <div style={{ color: '#64748b', marginTop: '0.4rem' }}>
              {expense.category} · {new Date(expense.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
