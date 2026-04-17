import { z } from 'zod';

export const cuidSchema = z.string().min(1);
export const isoDateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Expected an ISO date string');
export const moneyStringSchema = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Expected a monetary string');
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
