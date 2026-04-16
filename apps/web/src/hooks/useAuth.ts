import type { LoginInput, RegisterInput, UserRecord } from '@financeos/shared';
import { useMutation, useQuery } from '@tanstack/react-query';


import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

type AuthPayload = {
  token: string;
  user: UserRecord;
};

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await api.post<{ success: true; data: AuthPayload }>('/auth/register', input);
      return response.data.data;
    },
    onSuccess: setSession,
  });
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<{ success: true; data: AuthPayload }>('/auth/login', input);
      return response.data.data;
    },
    onSuccess: setSession,
  });
}

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['auth', 'me', token],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: UserRecord }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
  });
}
