import { useQuery } from '@tanstack/react-query';

import type { ExpenseRecord, PaginatedResult } from '@financeos/shared';

import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export function useExpenses() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['expenses'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<ExpenseRecord> }>('/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          pageSize: 20,
        },
      });
      return response.data.data;
    },
  });
}
