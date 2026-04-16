import { z } from 'zod';

import { invoiceStatuses } from '../constants/domain';

import { cuidSchema, isoDateSchema, moneyStringSchema, paginationSchema } from './common.schema';

export const lineItemSchema = z.object({
  description: z.string().min(1).max(250),
  quantity: moneyStringSchema,
  unitPrice: moneyStringSchema,
  sortOrder: z.number().int().nonnegative().default(0),
});

export const createInvoiceSchema = z.object({
  clientId: cuidSchema,
  issueDate: isoDateSchema,
  dueDate: isoDateSchema,
  taxRate: moneyStringSchema.default('0'),
  notes: z.string().max(5000).optional(),
  lineItems: z.array(lineItemSchema).min(1),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: z.enum(invoiceStatuses).optional(),
});

export const invoiceQuerySchema = paginationSchema.extend({
  status: z.enum(invoiceStatuses).optional(),
  clientId: cuidSchema.optional(),
  search: z.string().max(120).optional(),
});

export const createPaymentSchema = z.object({
  amount: moneyStringSchema,
  paidAt: isoDateSchema,
  method: z.string().max(80).optional(),
  notes: z.string().max(2000).optional(),
});
