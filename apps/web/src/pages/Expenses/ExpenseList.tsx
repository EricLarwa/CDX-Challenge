import { Link, useLocation } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { useExpenses } from '../../hooks/useExpenses';
import { downloadCsv } from '../../lib/export';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ExpenseListPage() {
  const location = useLocation();
  const expensesQuery = useExpenses();
  const expenses = expensesQuery.data?.items ?? [];
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Expenses"
        description="Expense data is now flowing through the shared contract into the UI."
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  'financeos-expenses.csv',
                  ['Description', 'Category', 'Amount', 'Date'],
                  expenses.map((expense) => [
                    expense.description,
                    expense.category,
                    Number(expense.amount).toFixed(2),
                    new Date(expense.date).toLocaleDateString(),
                  ]),
                )
              }
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Export CSV
            </button>
            <ButtonLink to="/expenses/new">Log expense</ButtonLink>
            <ButtonLink to="/expenses/analytics" tone="secondary">
              View analytics
            </ButtonLink>
          </div>
        }
      />
      {typeof location.state === 'object' && location.state && 'notice' in location.state ? (
        <FeedbackBanner tone="success" message={String(location.state.notice)} />
      ) : null}
      {expensesQuery.isError ? (
        <FeedbackBanner tone="error" message="We couldn't load expenses for this view. Please retry after the server refreshes." />
      ) : null}
      <Card>
        <CardContent className="p-5 text-sm text-slate-600">
          Tracked spend in this view: <span className="font-semibold text-slate-950">{currency.format(total)}</span>
        </CardContent>
      </Card>
      <div className="grid gap-3">
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
          <Card key={expense.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <strong className="text-slate-950">{expense.description}</strong>
                <span className="font-medium text-slate-700">{currency.format(Number(expense.amount))}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {expense.category} · {new Date(expense.date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Link to="/reports" className="text-sm font-semibold text-indigo-700 no-underline hover:text-indigo-800">
          Open reports to compare expense impact against revenue
        </Link>
      </div>
    </div>
  );
}
