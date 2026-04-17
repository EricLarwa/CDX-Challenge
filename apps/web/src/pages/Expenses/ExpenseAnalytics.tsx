import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useExpenses } from '../../hooks/useExpenses';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ExpenseAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const from = searchParams.get('from') ?? '2026-04-01';
  const to = searchParams.get('to') ?? '2026-04-30';
  const expensesQuery = useExpenses({ category: category || undefined, from, to });
  const expenses = useMemo(() => expensesQuery.data?.items ?? [], [expensesQuery.data?.items]);

  const byCategory = useMemo(
    () =>
      expenses.reduce<Record<string, number>>((acc, expense) => {
        acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount);
        return acc;
      }, {}),
    [expenses],
  );

  const ranked = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const recurringCount = expenses.filter((expense) => expense.isRecurring).length;

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title="Expense analytics"
        description="Category totals and spend concentration are now reachable directly from the expenses module."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/expenses">Back to expenses</ButtonLink>
            <ButtonLink to={`/reports/pnl?from=${from}&to=${to}`} tone="secondary">
              Compare with profit
            </ButtonLink>
            <ButtonLink to={`/cashflow?from=${from}&to=${to}`} tone="secondary">
              Cash flow impact
            </ButtonLink>
          </div>
        }
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(180px, 220px) minmax(180px, 220px) minmax(180px, 220px)',
          gap: '0.75rem',
          padding: '1rem',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
        }}
      >
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>Category</span>
          <select
            value={category}
            onChange={(event) => setSearchParams({ from, to, ...(event.target.value ? { category: event.target.value } : {}) })}
            style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
          >
            <option value="">All categories</option>
            {['SOFTWARE', 'TRAVEL', 'MEALS', 'EQUIPMENT', 'CONTRACTORS', 'UTILITIES', 'MARKETING', 'TAXES', 'INSURANCE', 'OTHER'].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>From</span>
          <input type="date" value={from} onChange={(event) => setSearchParams({ from: event.target.value, to, ...(category ? { category } : {}) })} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: '#475569', fontSize: '0.9rem' }}>To</span>
          <input type="date" value={to} onChange={(event) => setSearchParams({ from, to: event.target.value, ...(category ? { category } : {}) })} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Spend in view</div>
          <strong style={{ fontSize: '1.25rem' }}>{currency.format(total)}</strong>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Transactions</div>
          <strong style={{ fontSize: '1.25rem' }}>{expenses.length}</strong>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Recurring expenses</div>
          <strong style={{ fontSize: '1.25rem' }}>{recurringCount}</strong>
        </div>
      </div>
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
