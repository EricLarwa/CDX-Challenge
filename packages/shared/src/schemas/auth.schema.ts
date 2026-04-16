import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(1).max(120).optional(),
  currency: z.string().length(3).default('USD'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
