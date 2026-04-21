import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';

import { sendError } from '../lib/api-response.js';

export const validateBody = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return sendError(res, result.error.issues[0]?.message ?? 'Invalid request body', 400);
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = <T extends ZodTypeAny>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return sendError(res, result.error.issues[0]?.message ?? 'Invalid query params', 400);
    }

    next();
  };
};
