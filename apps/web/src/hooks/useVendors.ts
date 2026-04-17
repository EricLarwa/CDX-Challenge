import type { CreateVendorInput } from '@financeos/shared';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import { getAuthHeaders } from '../lib/auth-headers';
import { useAuthStore } from '../stores/auth.store';

type VendorItem = {
  id: string;
  name: string;
  category: string | null;
  email: string | null;
};

export function useVendors() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['vendors'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: { items: VendorItem[] } }>('/vendors', {
        headers: getAuthHeaders(token),
      });
      return response.data.data.items;
    },
  });
}

export function useCreateVendor() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateVendorInput) => {
      const response = await api.post<{ success: true; data: VendorItem }>('/vendors', input, {
        headers: getAuthHeaders(token),
      });
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
