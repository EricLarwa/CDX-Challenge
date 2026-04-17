import { z } from 'zod';

import { expenseCategories } from '../constants/domain';

import { cuidSchema, isoDateSchema, moneyStringSchema, paginationSchema } from './common.schema';

export const createExpenseSchema = z.object({
  vendorId: cuidSchema.optional(),
  amount: moneyStringSchema,
  category: z.enum(expenseCategories),
  description: z.string().min(1).max(250),
  date: isoDateSchema,
  isRecurring: z.boolean().default(false),
  receiptUrl: z.string().url().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseQuerySchema = paginationSchema.extend({
  category: z.enum(expenseCategories).optional(),
  vendorId: cuidSchema.optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
});

export const categorizeExpenseSchema = z.object({
  description: z.string().min(3).max(250),
});

export const analyzeExpenseSchema = z.object({
  vendorId: cuidSchema.optional(),
  amount: moneyStringSchema,
  date: isoDateSchema,
});
