import type { Request, Response } from 'express';

import { sendError } from '../lib/api-response';

export const notFoundMiddleware = (_req: Request, res: Response) => {
  return sendError(res, 'Resource not found', 404);
};
