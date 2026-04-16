import type { Request, Response } from 'express';

import { sendSuccess } from '../lib/api-response';
import { getAuthUserId } from '../lib/request';
import * as vendorService from '../services/vendor.service';

export const listVendors = async (req: Request, res: Response) => {
  return sendSuccess(res, await vendorService.listVendors(getAuthUserId(req)));
};

export const createVendor = async (req: Request, res: Response) => {
  return sendSuccess(res, await vendorService.createVendor(getAuthUserId(req), req.body), 201);
};
