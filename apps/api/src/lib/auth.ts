import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import { env } from './env.js';

export type AuthTokenPayload = {
  userId: string;
  email: string;
};

export const signAuthToken = (payload: AuthTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
};
