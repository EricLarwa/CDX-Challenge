import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import * as dashboardService from '../services/dashboard.service';

export const getDashboard = async (_req: Request, res: Response) => {
  return sendSuccess(res, await dashboardService.getDashboard());
};
