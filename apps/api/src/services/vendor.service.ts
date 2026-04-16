import { mockVendors, toPaginated } from '../lib/mock-data';

export const listVendors = async () => toPaginated(mockVendors);

export const createVendor = async (input: {
  name: string;
  category?: string;
  email?: string;
  notes?: string;
}) => ({
  id: 'ven_new',
  name: input.name,
  category: input.category ?? null,
  email: input.email ?? null,
  notes: input.notes ?? null,
  createdAt: new Date().toISOString(),
});
