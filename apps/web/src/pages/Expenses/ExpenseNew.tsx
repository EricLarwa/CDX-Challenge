import type { CreateExpenseInput } from '@financeos/shared';
import { createExpenseSchema, expenseCategories } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

import { PageHeader } from '../../components/shared/PageHeader';
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
          navigate('/expenses');
        })}
        style={{ display: 'grid', gap: '1rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Description</span>
            <input {...form.register('description')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
          </label>
          <div style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Category</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select {...form.register('category')} style={{ flex: 1, padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={async () => {
                  const description = form.getValues('description');
                  if (!description) return;
                  const suggestion = await categorizeExpense.mutateAsync({ description });
                  form.setValue('category', suggestion.category as ExpenseFormValues['category']);
                }}
                style={{ padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', background: 'white' }}
              >
                {categorizeExpense.isPending ? 'Thinking...' : 'Suggest'}
              </button>
            </div>
            {categorizeExpense.data ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Suggested by {categorizeExpense.data.source === 'ai' ? 'AI' : 'fallback rules'}: {categorizeExpense.data.category}
              </div>
            ) : null}
          </div>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Amount</span>
            <input {...form.register('amount')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Date</span>
            <input {...form.register('date')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Vendor</span>
            <select {...form.register('vendorId')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
              <option value="">No vendor</option>
              {(vendorsQuery.data ?? []).map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Receipt URL</span>
            <input {...form.register('receiptUrl')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <input type="checkbox" {...form.register('isRecurring')} />
          <span>Recurring expense</span>
        </label>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <strong>Anomaly check</strong>
            <button
              type="button"
              onClick={async () => {
                const result = await analyzeExpense.mutateAsync({
                  vendorId: form.getValues('vendorId') || undefined,
                  amount: form.getValues('amount'),
                  date: form.getValues('date'),
                });
                setAnomalyMessages(result.anomalies.map((anomaly) => anomaly.message));
              }}
              style={{ padding: '0.8rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', background: 'white' }}
            >
              {analyzeExpense.isPending ? 'Checking...' : 'Check for issues'}
            </button>
          </div>
          {anomalyMessages.length ? (
            anomalyMessages.map((message) => (
              <div key={message} style={{ color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '0.75rem' }}>
                {message}
              </div>
            ))
          ) : (
            <div style={{ color: '#64748b' }}>No anomaly warnings yet. Run a check before saving if you want a quick sanity pass.</div>
          )}
        </div>

        {createExpense.isError ? <p style={{ color: '#b91c1c', margin: 0 }}>Could not log expense.</p> : null}

        <button type="submit" style={{ padding: '0.95rem 1rem', borderRadius: '0.85rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
          {createExpense.isPending ? 'Saving expense...' : 'Log expense'}
        </button>
      </form>
    </div>
  );
}
