import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import { getAuthUserId } from '../lib/request';
import * as dashboardService from '../services/dashboard.service';

export const getDashboard = async (req: Request, res: Response) => {
  return sendSuccess(res, await dashboardService.getDashboard(getAuthUserId(req)));
};
