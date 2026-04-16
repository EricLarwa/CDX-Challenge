import type { Request, Response } from 'express';

import { sendError, sendSuccess } from '../lib/api-response';
import { getRequiredParam } from '../lib/request';
import * as clientService from '../services/client.service';

export const listClients = async (_req: Request, res: Response) => {
  return sendSuccess(res, await clientService.listClients());
};

export const getClient = async (req: Request, res: Response) => {
  const client = await clientService.getClientById(getRequiredParam(req, 'id'));
  return client ? sendSuccess(res, client) : sendError(res, 'Client not found', 404);
};

export const createClient = async (req: Request, res: Response) => {
  return sendSuccess(res, await clientService.createClient(req.body), 201);
};

export const updateClient = async (req: Request, res: Response) => {
  const client = await clientService.getClientById(getRequiredParam(req, 'id'));
  return client ? sendSuccess(res, { ...client, ...req.body }) : sendError(res, 'Client not found', 404);
};
