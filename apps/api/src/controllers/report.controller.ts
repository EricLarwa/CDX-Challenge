import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import { getAuthUserId } from '../lib/request';
import * as reportService from '../services/report.service';

export const getProfitAndLoss = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    await reportService.getProfitAndLoss(getAuthUserId(req), String(req.query.from), String(req.query.to)),
  );
};

export const getCashFlow = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    await reportService.getCashFlowReport(getAuthUserId(req), String(req.query.from), String(req.query.to)),
  );
};

export const getAccountsReceivableAging = async (req: Request, res: Response) => {
  return sendSuccess(res, await reportService.getAccountsReceivableAging(getAuthUserId(req)));
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    await reportService.getMonthlySummary(getAuthUserId(req), Number(req.params.year), Number(req.params.month)),
  );
};
