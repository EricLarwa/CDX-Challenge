import type { Request } from 'express';

import { HttpError } from './http-error.js';

export const getRequiredParam = (req: Request, key: string) => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    throw new HttpError(`Missing route parameter: ${key}`, 400);
  }

  return value;
};

export const getAuthUserId = (req: Request) => {
  if (!req.auth?.userId) {
    throw new HttpError('Unauthorized', 401);
  }

  return req.auth.userId;
};
