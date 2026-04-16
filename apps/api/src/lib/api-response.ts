import type { Response } from 'express';

import type { ApiResponse } from '@financeos/shared';

export const sendSuccess = <T>(res: Response, data: T, status = 200) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };

  return res.status(status).json(payload);
};

export const sendError = (res: Response, error: string, status = 400) => {
  const payload: ApiResponse<never> = {
    success: false,
    error,
  };

  return res.status(status).json(payload);
};
