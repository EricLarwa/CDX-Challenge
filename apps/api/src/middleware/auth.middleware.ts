import type { NextFunction, Request, Response } from 'express';

import { sendError } from '../lib/api-response';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized', 401);
  }

  next();
};
