import type { NextFunction, Request, Response } from 'express';

/**
 * Wraps async route handlers to properly catch and pass errors to next()
 * Prevents unhandled promise rejections in async Express routes
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
