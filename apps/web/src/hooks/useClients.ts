import { useQuery } from '@tanstack/react-query';

import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

type ClientListItem = {
  id: string;
  name: string;
  email: string | null;
  paymentTerms: number;
  outstanding: string;
  totalInvoiced: string;
};

type ClientDetail = {
  id: string;
  name: string;
  email: string | null;
  paymentTerms: number;
  notes: string | null;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
    total: string;
    amountPaid: string;
  }>;
};

export function useClients() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['clients'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: { items: ClientListItem[] } }>('/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.items;
    },
  });
}

export function useClientDetail(id: string | undefined) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['clients', id],
    enabled: Boolean(token && id),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: ClientDetail }>(`/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
}
