import { create } from 'zustand';

import type { UserRecord } from '@financeos/shared';

type AuthState = {
  token: string | null;
  user: UserRecord | null;
  setSession: (payload: { token: string; user: UserRecord }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));
