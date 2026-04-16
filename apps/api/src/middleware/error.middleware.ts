import type { NextFunction, Request, Response } from 'express';

import { sendError } from '../lib/api-response';
import { HttpError } from '../lib/http-error';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    return sendError(res, error.message, error.statusCode);
  }

  console.error(error);
  return sendError(res, 'Internal server error', 500);
};
