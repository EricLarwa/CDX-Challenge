import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { ListSkeleton } from '../../components/shared/ListSkeleton';
import { MetricGridSkeleton } from '../../components/shared/MetricGridSkeleton';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useExpenses } from '../../hooks/useExpenses';
import { downloadCsv } from '../../lib/export';

export function ExpenseListPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';
  const amountMin = searchParams.get('amountMin') ?? '';
  const amountMax = searchParams.get('amountMax') ?? '';
  const expensesQuery = useExpenses({
    category: category || undefined,
    from: from || undefined,
    to: to || undefined,
    amountMin: amountMin || undefined,
    amountMax: amountMax || undefined,
  });
  const { formatCurrency } = useCurrencyFormatter();
  const expenses = expensesQuery.data?.items ?? [];
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const recurringCount = expenses.filter((expense) => expense.isRecurring).length;
  const hasActiveFilters = Boolean(category || from || to || amountMin || amountMax);

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Expenses"
        description="Expense data is now flowing through the shared contract into the UI."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
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
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
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
      {expensesQuery.isLoading ? <MetricGridSkeleton cards={3} /> : null}
      {!expensesQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Spend in view</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{formatCurrency(total)}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Transactions</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{expenses.length}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Recurring</div>
            <strong className="mt-2 block text-2xl font-semibold text-slate-950">{recurringCount}</strong>
          </CardContent>
        </Card>
        </div>
      ) : null}
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
          <Label>
            <span>Category</span>
            <Select
              value={category}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set('category', event.target.value);
                } else {
                  next.delete('category');
                }
                setSearchParams(next);
              }}
            >
              <option value="">All categories</option>
              {['SOFTWARE', 'TRAVEL', 'MEALS', 'EQUIPMENT', 'CONTRACTORS', 'UTILITIES', 'MARKETING', 'TAXES', 'INSURANCE', 'OTHER'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Label>
          <Label>
            <span>From</span>
            <Input
              type="date"
              value={from}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set('from', event.target.value);
                } else {
                  next.delete('from');
                }
                setSearchParams(next);
              }}
            />
          </Label>
          <Label>
            <span>To</span>
            <Input
              type="date"
              value={to}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set('to', event.target.value);
                } else {
                  next.delete('to');
                }
                setSearchParams(next);
              }}
            />
          </Label>
          <Label>
            <span>Min amount</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amountMin}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set('amountMin', event.target.value);
                } else {
                  next.delete('amountMin');
                }
                setSearchParams(next);
              }}
              placeholder="0.00"
            />
          </Label>
          <Label>
            <span>Max amount</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amountMax}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set('amountMax', event.target.value);
                } else {
                  next.delete('amountMax');
                }
                setSearchParams(next);
              }}
              placeholder="1000.00"
            />
          </Label>
          {hasActiveFilters ? (
            <div className="flex items-end">
              <Button data-testid="expense-clear-filters" type="button" variant="secondary" onClick={() => setSearchParams({})}>
                Clear filters
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {expensesQuery.isLoading ? <ListSkeleton rows={5} /> : null}
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
                <span className="font-medium text-slate-700">{formatCurrency(expense.amount)}</span>
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
