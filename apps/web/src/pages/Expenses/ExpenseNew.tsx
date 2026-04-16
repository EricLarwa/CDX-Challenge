import type { CreateExpenseInput } from '@financeos/shared';
import { createExpenseSchema, expenseCategories } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';


import { PageHeader } from '../../components/shared/PageHeader';
import { useCategorizeExpense, useCreateExpense } from '../../hooks/useExpenses';
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

        {createExpense.isError ? <p style={{ color: '#b91c1c', margin: 0 }}>Could not log expense.</p> : null}

        <button type="submit" style={{ padding: '0.95rem 1rem', borderRadius: '0.85rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
          {createExpense.isPending ? 'Saving expense...' : 'Log expense'}
        </button>
      </form>
    </div>
  );
}
