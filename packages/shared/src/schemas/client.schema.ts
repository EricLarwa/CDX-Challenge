import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  address: z.string().max(250).optional(),
  paymentTerms: z.number().int().min(0).max(120).default(30),
  notes: z.string().max(2000).optional(),
});

export const updateClientSchema = createClientSchema.partial();
