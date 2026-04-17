import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useExpenses } from '../../hooks/useExpenses';
import { downloadCsv } from '../../lib/export';

export function ExpenseAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const from = searchParams.get('from') ?? '2026-04-01';
  const to = searchParams.get('to') ?? '2026-04-30';
  const expensesQuery = useExpenses({ category: category || undefined, from, to });
  const expenses = useMemo(() => expensesQuery.data?.items ?? [], [expensesQuery.data?.items]);
  const { formatCurrency } = useCurrencyFormatter();

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
    <div className="grid gap-4">
      <PageHeader
        title="Expense analytics"
        description="Category totals and spend concentration are now reachable directly from the expenses module."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv(
                  'financeos-expense-analytics.csv',
                  ['Category', 'Amount'],
                  ranked.map(([categoryName, amount]) => [categoryName, amount.toFixed(2)]),
                )
              }
            >
              Export CSV
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
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
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="expense-analytics-category">Category</Label>
            <Select
              id="expense-analytics-category"
              value={category}
              onChange={(event) => setSearchParams({ from, to, ...(event.target.value ? { category: event.target.value } : {}) })}
            >
              <option value="">All categories</option>
              {['SOFTWARE', 'TRAVEL', 'MEALS', 'EQUIPMENT', 'CONTRACTORS', 'UTILITIES', 'MARKETING', 'TAXES', 'INSURANCE', 'OTHER'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-analytics-from">From</Label>
            <Input
              id="expense-analytics-from"
              type="date"
              value={from}
              onChange={(event) => setSearchParams({ from: event.target.value, to, ...(category ? { category } : {}) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-analytics-to">To</Label>
            <Input
              id="expense-analytics-to"
              type="date"
              value={to}
              onChange={(event) => setSearchParams({ from, to: event.target.value, ...(category ? { category } : {}) })}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Spend in view</div>
            <strong className="text-xl font-semibold text-slate-950">{formatCurrency(total)}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Transactions</div>
            <strong className="text-xl font-semibold text-slate-950">{expenses.length}</strong>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">Recurring expenses</div>
            <strong className="text-xl font-semibold text-slate-950">{recurringCount}</strong>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-5">
          <strong className="text-slate-950">Spend by category</strong>
          <div className="mt-4 grid gap-3">
            {ranked.length ? (
              ranked.map(([categoryName, amount]) => (
                <div
                  key={categoryName}
                  className="grid items-center gap-3 md:grid-cols-[160px_minmax(0,1fr)_auto]"
                >
                  <span className="font-semibold text-slate-900">{categoryName}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                      style={{
                        width: `${Math.max(8, (amount / ((ranked[0]?.[1] ?? amount) || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <strong className="text-slate-700">{formatCurrency(amount)}</strong>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No expenses yet. Log an expense to start building analytics.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
