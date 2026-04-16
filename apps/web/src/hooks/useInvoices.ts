import type { InvoiceRecord, PaginatedResult } from '@financeos/shared';
import { useQuery } from '@tanstack/react-query';


import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export function useInvoices() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['invoices'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: PaginatedResult<InvoiceRecord> }>('/invoices', {
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
