import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import * as vendorService from '../services/vendor.service';

export const listVendors = async (_req: Request, res: Response) => {
  return sendSuccess(res, await vendorService.listVendors());
};

export const createVendor = async (req: Request, res: Response) => {
  return sendSuccess(res, await vendorService.createVendor(req.body), 201);
};
