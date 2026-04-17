import type {
  AnalyzeExpenseInput,
  CategorizeExpenseInput,
  CreateExpenseInput,
  ExpenseRecord,
  PaginatedResult,
} from '@financeos/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


import { api } from '../lib/api';
import { getAuthHeaders } from '../lib/auth-headers';
import { useAuthStore } from '../stores/auth.store';

export function useExpenses(filters?: { category?: string; from?: string; to?: string }) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['expenses', filters?.category ?? 'ALL', filters?.from ?? '', filters?.to ?? ''],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<ExpenseRecord> }>('/expenses', {
        headers: getAuthHeaders(token),
        params: {
          page: 1,
          pageSize: 20,
          ...(filters?.category ? { category: filters.category } : {}),
          ...(filters?.from ? { from: `${filters.from}T00:00:00.000Z` } : {}),
          ...(filters?.to ? { to: `${filters.to}T23:59:59.999Z` } : {}),
        },
      });
      return response.data.data;
    },
  });
}

export function useCreateExpense() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const response = await api.post<{ success: true; data: ExpenseRecord }>('/expenses', input, {
        headers: getAuthHeaders(token),
      });
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expenses'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useCategorizeExpense() {
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async (input: CategorizeExpenseInput) => {
      const response = await api.post<{ success: true; data: { category: string; source: 'ai' | 'fallback' } }>(
        '/expenses/categorize',
        input,
        {
          headers: getAuthHeaders(token),
        },
      );
      return response.data.data;
    },
  });
}

export function useAnalyzeExpense() {
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async (input: AnalyzeExpenseInput) => {
      const response = await api.post<{ success: true; data: { anomalies: Array<{ kind: string; message: string }> } }>(
        '/expenses/analyze',
        input,
        {
          headers: getAuthHeaders(token),
        },
      );
      return response.data.data;
    },
  });
}
