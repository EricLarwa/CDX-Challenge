import type {
  CreateInvoiceInput,
  InvoiceRecord,
  PaginatedResult,
  createInvoiceSchema,
} from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';


import { api } from '../lib/api';
import { getAuthHeaders } from '../lib/auth-headers';
import { useAuthStore } from '../stores/auth.store';

export type InvoiceFormValues = z.infer<typeof createInvoiceSchema>;

export function useInvoices() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['invoices'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<InvoiceRecord> }>('/invoices', {
        headers: getAuthHeaders(token),
        params: {
          page: 1,
          pageSize: 20,
        },
      });
      return response.data.data;
    },
  });
}

export function useCreateInvoice() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInvoiceInput) => {
      const response = await api.post<{ success: true; data: InvoiceRecord }>('/invoices', input, {
        headers: getAuthHeaders(token),
      });
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export const invoiceFormResolver = zodResolver;
