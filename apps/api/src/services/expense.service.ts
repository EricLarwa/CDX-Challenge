import type { CategorizeExpenseInput, CreateExpenseInput, ExpenseQuery, ExpenseRecord, UpdateExpenseInput } from '@financeos/shared';

import { mockExpenses, toPaginated } from '../lib/mock-data';

export const listExpenses = async (_query: ExpenseQuery) => toPaginated(mockExpenses);

export const getExpenseById = async (id: string) => mockExpenses.find((expense) => expense.id === id) ?? null;

export const createExpense = async (input: CreateExpenseInput): Promise<ExpenseRecord> => ({
  id: 'exp_new',
  vendorId: input.vendorId ?? null,
  amount: input.amount,
  category: input.category,
  description: input.description,
  date: input.date,
  isRecurring: input.isRecurring,
  receiptUrl: input.receiptUrl ?? null,
  aiCategorized: false,
});

export const updateExpense = async (id: string, input: UpdateExpenseInput) => {
  const existing = mockExpenses.find((expense) => expense.id === id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    ...input,
    vendorId: input.vendorId ?? existing.vendorId,
    receiptUrl: input.receiptUrl ?? existing.receiptUrl,
  };
};

export const categorizeExpense = async (input: CategorizeExpenseInput) => {
  const category = input.description.toLowerCase().includes('flight') ? 'TRAVEL' : 'OTHER';
  return { category };
};
