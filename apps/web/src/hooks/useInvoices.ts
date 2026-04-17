import type {
  CreateInvoiceInput,
  CreatePaymentInput,
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

export function useInvoices(filters?: { search?: string; status?: string }) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['invoices', filters?.search ?? '', filters?.status ?? 'ALL'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<InvoiceRecord> }>('/invoices', {
        headers: getAuthHeaders(token),
        params: {
          page: 1,
          pageSize: 20,
          ...(filters?.search ? { search: filters.search } : {}),
          ...(filters?.status ? { status: filters.status } : {}),
        },
      });
      return response.data.data;
    },
  });
}

export function useInvoiceDetail(id: string | undefined) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['invoices', id],
    enabled: Boolean(token && id),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: InvoiceRecord }>(`/invoices/${id}`, {
        headers: getAuthHeaders(token),
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

export function useSendInvoice(id: string | undefined) {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ success: true; data: InvoiceRecord }>(
        `/invoices/${id}/send`,
        {},
        {
          headers: getAuthHeaders(token),
        },
      );
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      await queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useRecordPayment(id: string | undefined) {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePaymentInput) => {
      const response = await api.post<{ success: true; data: InvoiceRecord }>(
        `/invoices/${id}/payments`,
        input,
        {
          headers: getAuthHeaders(token),
        },
      );
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      await queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export const invoiceFormResolver = zodResolver;
