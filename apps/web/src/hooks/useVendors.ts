import { useQuery } from '@tanstack/react-query';

import { api } from '../lib/api';
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.items;
    },
  });
}
