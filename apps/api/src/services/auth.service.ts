import type { LoginInput, RegisterInput, UserRecord } from '@financeos/shared';

import { mockUser } from '../lib/mock-data';

export const register = async (input: RegisterInput) => {
  const user: UserRecord = {
    ...mockUser,
    email: input.email,
    businessName: input.businessName ?? null,
    currency: input.currency,
  };

  return {
    user,
    token: 'demo-jwt-token',
  };
};

export const login = async (input: LoginInput) => {
  return {
    user: {
      ...mockUser,
      email: input.email,
    },
    token: 'demo-jwt-token',
  };
};

export const getCurrentUser = async () => mockUser;
