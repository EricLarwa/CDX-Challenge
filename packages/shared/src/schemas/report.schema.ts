import { z } from 'zod';

export const dateRangeQuerySchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export const monthlySummaryParamsSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});
