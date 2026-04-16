import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import * as reportService from '../services/report.service';

export const getProfitAndLoss = async (_req: Request, res: Response) => {
  return sendSuccess(res, await reportService.getProfitAndLoss());
};

export const getCashFlow = async (_req: Request, res: Response) => {
  return sendSuccess(res, await reportService.getCashFlowReport());
};

export const getAccountsReceivableAging = async (_req: Request, res: Response) => {
  return sendSuccess(res, await reportService.getAccountsReceivableAging());
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    await reportService.getMonthlySummary(Number(req.params.year), Number(req.params.month)),
  );
};
