import type { CreateClientInput, InvoiceRecord } from '@financeos/shared';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import { getAuthHeaders } from '../lib/auth-headers';
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
  invoices: InvoiceRecord[];
};

export function useClients() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['clients'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: { items: ClientListItem[] } }>('/clients', {
        headers: getAuthHeaders(token),
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
        headers: getAuthHeaders(token),
      });
      return response.data.data;
    },
  });
}

export function useCreateClient() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateClientInput) => {
      const response = await api.post<{ success: true; data: ClientListItem }>('/clients', input, {
        headers: getAuthHeaders(token),
      });
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
