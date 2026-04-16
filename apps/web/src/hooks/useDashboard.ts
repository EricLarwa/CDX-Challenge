import { useQuery } from '@tanstack/react-query';

import type { DashboardPayload } from '@financeos/shared';

import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

export function useDashboard() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['dashboard'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: DashboardPayload }>('/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
  });
}
