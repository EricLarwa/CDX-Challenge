import type { z } from 'zod';

import type {
  categorizeExpenseSchema,
  createExpenseSchema,
  expenseQuerySchema,
  updateExpenseSchema,
} from '../schemas/expense.schema';

export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type CategorizeExpenseInput = z.infer<typeof categorizeExpenseSchema>;
