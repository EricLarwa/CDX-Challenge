import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  return sendSuccess(res, await authService.register(req.body), 201);
};

export const login = async (req: Request, res: Response) => {
  return sendSuccess(res, await authService.login(req.body));
};

export const logout = async (_req: Request, res: Response) => {
  return sendSuccess(res, { ok: true });
};

export const getCurrentUser = async (_req: Request, res: Response) => {
  return sendSuccess(res, await authService.getCurrentUser());
};
