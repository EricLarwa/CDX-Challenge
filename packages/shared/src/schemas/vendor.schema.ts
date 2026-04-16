import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().max(120).optional(),
  email: z.string().email().optional(),
  notes: z.string().max(2000).optional(),
});

export const updateVendorSchema = createVendorSchema.partial();
