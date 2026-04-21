import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { sendError } from '../lib/api-response.js';
import { HttpError } from '../lib/http-error.js';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    return sendError(res, error.message, error.statusCode);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return sendError(
      res,
      'Database connection failed. Make sure Postgres is running and the API DATABASE_URL is correct.',
      503,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P1001') {
      return sendError(
        res,
        'Database connection failed. Make sure Postgres is running and the API DATABASE_URL is correct.',
        503,
      );
    }

    if (error.code === 'P2021' || error.code === 'P2022') {
      return sendError(
        res,
        'Database schema is out of date. Run the FinanceOS Prisma migration and seed steps, then restart the API.',
        500,
      );
    }
  }

  console.error(error);
  return sendError(res, 'Internal server error', 500);
};
