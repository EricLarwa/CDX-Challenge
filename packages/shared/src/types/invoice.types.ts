import type { z } from 'zod';

import type {
  createInvoiceSchema,
  createPaymentSchema,
  invoiceQuerySchema,
  updateInvoiceSchema,
} from '../schemas/invoice.schema';

export type InvoiceQuery = z.infer<typeof invoiceQuerySchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
