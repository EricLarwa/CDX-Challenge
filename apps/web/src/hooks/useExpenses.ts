import type {
  CategorizeExpenseInput,
  CreateExpenseInput,
  ExpenseRecord,
  PaginatedResult,
} from '@financeos/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


import { api } from '../lib/api';
import { getAuthHeaders } from '../lib/auth-headers';
import { useAuthStore } from '../stores/auth.store';

export function useExpenses() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['expenses'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<ExpenseRecord> }>('/expenses', {
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
      const response = await api.post<{ success: true; data: { category: string } }>(
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
