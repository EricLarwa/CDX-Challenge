import type { LoginInput, RegisterInput } from '@financeos/shared';
import bcrypt from 'bcryptjs';


import { signAuthToken } from '../lib/auth';
import { HttpError } from '../lib/http-error';
import { prisma } from '../lib/prisma';
import { serializeUser } from '../lib/serializers';

export const register = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser && !existingUser.deletedAt) {
    throw new HttpError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      businessName: input.businessName,
      currency: input.currency,
    },
  });

  return {
    user: serializeUser(user),
    token: signAuthToken({ userId: user.id, email: user.email }),
  };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || user.deletedAt) {
    throw new HttpError('Invalid credentials', 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError('Invalid credentials', 401);
  }

  return {
    user: serializeUser(user),
    token: signAuthToken({ userId: user.id, email: user.email }),
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  return serializeUser(user);
};
