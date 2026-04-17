import type { UserRecord } from '@financeos/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserPreferences = {
  defaultTaxRate: string;
  defaultPaymentTerms: number;
};

type AuthState = {
  token: string | null;
  user: UserRecord | null;
  preferences: UserPreferences;
  setSession: (payload: { token: string; user: UserRecord }) => void;
  updateUser: (user: Partial<UserRecord>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      preferences: {
        defaultTaxRate: '0',
        defaultPaymentTerms: 14,
      },
      setSession: ({ token, user }) => set({ token, user }),
      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : state.user,
        })),
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        })),
      clearSession: () =>
        set({
          token: null,
          user: null,
          preferences: {
            defaultTaxRate: '0',
            defaultPaymentTerms: 14,
          },
        }),
    }),
    {
      name: 'financeos-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        preferences: state.preferences,
      }),
    },
  ),
);
