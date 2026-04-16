import type { Request } from 'express';

import { HttpError } from './http-error';

export const getRequiredParam = (req: Request, key: string) => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    throw new HttpError(`Missing route parameter: ${key}`, 400);
  }

  return value;
};
