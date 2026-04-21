import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response.js';
import { getAuthUserId } from '../lib/request.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboard = async (req: Request, res: Response) => {
  return sendSuccess(res, await dashboardService.getDashboard(getAuthUserId(req)));
};
