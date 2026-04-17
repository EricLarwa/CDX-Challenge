import type { CreateExpenseInput } from '@financeos/shared';
import { createExpenseSchema, expenseCategories } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useAnalyzeExpense, useCategorizeExpense, useCreateExpense } from '../../hooks/useExpenses';
import { useVendors } from '../../hooks/useVendors';

type ExpenseFormValues = z.input<typeof createExpenseSchema>;

const defaultValues: ExpenseFormValues = {
  vendorId: undefined,
  amount: '0.00',
  category: 'OTHER',
  description: '',
  date: '2026-04-16T00:00:00.000Z',
  isRecurring: false,
  receiptUrl: undefined,
};

export function ExpenseNewPage() {
  const navigate = useNavigate();
  const vendorsQuery = useVendors();
  const createExpense = useCreateExpense();
  const categorizeExpense = useCategorizeExpense();
  const analyzeExpense = useAnalyzeExpense();
  const [anomalyMessages, setAnomalyMessages] = useState<string[]>([]);
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues,
  });

  return (
    <div>
      <PageHeader title="Log expense" description="Capture a business expense quickly, with optional AI category suggestion." />
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const payload: CreateExpenseInput = {
            amount: values.amount,
            category: values.category,
            description: values.description,
            date: values.date,
            isRecurring: values.isRecurring ?? false,
            vendorId: values.vendorId || undefined,
            receiptUrl: values.receiptUrl || undefined,
          };
          await createExpense.mutateAsync(payload);
          navigate('/expenses', { state: { notice: 'Expense logged successfully.' } });
        })}
        data-testid="expense-form"
        className="grid gap-4"
      >
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-2">
          <Label>
            <span>Description</span>
            <Input data-testid="expense-description" {...form.register('description')} />
          </Label>
          <div className="grid gap-1.5">
            <span>Category</span>
            <div className="flex gap-3">
              <Select {...form.register('category')} className="flex-1">
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  const description = form.getValues('description');
                  if (!description) return;
                  const suggestion = await categorizeExpense.mutateAsync({ description });
                  form.setValue('category', suggestion.category as ExpenseFormValues['category']);
                }}
              >
                {categorizeExpense.isPending ? 'Thinking...' : 'Suggest'}
              </Button>
            </div>
            {categorizeExpense.data ? (
              <div className="text-sm text-slate-500">
                Suggested by {categorizeExpense.data.source === 'ai' ? 'AI' : 'fallback rules'}: {categorizeExpense.data.category}
              </div>
            ) : null}
          </div>
          <Label>
            <span>Amount</span>
            <Input data-testid="expense-amount" {...form.register('amount')} />
          </Label>
          <Label>
            <span>Date</span>
            <Input {...form.register('date')} />
          </Label>
          <Label>
            <span>Vendor</span>
            <Select {...form.register('vendorId')}>
              <option value="">No vendor</option>
              {(vendorsQuery.data ?? []).map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </Select>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <ButtonLink to="/vendors/new" tone="secondary">
                Add vendor
              </ButtonLink>
              {(vendorsQuery.data ?? []).length === 0 && !vendorsQuery.isLoading ? (
                <span className="text-slate-500">No vendors yet. Add one if you want this expense tied to a supplier.</span>
              ) : null}
            </div>
          </Label>
          <Label>
            <span>Receipt URL</span>
            <Input {...form.register('receiptUrl')} />
          </Label>
          </CardContent>
        </Card>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" {...form.register('isRecurring')} />
          <span>Recurring expense</span>
        </label>

        <Card>
          <CardContent className="grid gap-4 p-5">
          <div className="flex items-center justify-between gap-4">
            <strong className="text-lg text-slate-900">Anomaly check</strong>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                const result = await analyzeExpense.mutateAsync({
                  vendorId: form.getValues('vendorId') || undefined,
                  amount: form.getValues('amount'),
                  date: form.getValues('date'),
                });
                setAnomalyMessages(result.anomalies.map((anomaly) => anomaly.message));
              }}
            >
              {analyzeExpense.isPending ? 'Checking...' : 'Check for issues'}
            </Button>
          </div>
          {anomalyMessages.length ? (
            anomalyMessages.map((message) => (
              <div key={message} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                {message}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">No anomaly warnings yet. Run a check before saving if you want a quick sanity pass.</div>
          )}
          </CardContent>
        </Card>

        {createExpense.isError ? <FeedbackBanner tone="error" message="Could not log expense." /> : null}

        <Button data-testid="expense-submit" type="submit">
          {createExpense.isPending ? 'Saving expense...' : 'Log expense'}
        </Button>
      </form>
    </div>
  );
}
