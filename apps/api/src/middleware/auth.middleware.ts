import type { NextFunction, Request, Response } from 'express';

import { sendError } from '../lib/api-response';
import { verifyAuthToken } from '../lib/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized', 401);
  }

  const token = header.slice('Bearer '.length);

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch {
    return sendError(res, 'Invalid token', 401);
  }
};
