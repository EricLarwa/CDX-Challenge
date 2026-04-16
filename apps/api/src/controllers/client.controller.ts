import type { Request, Response } from 'express';

import { sendError, sendSuccess } from '../lib/api-response';
import { getAuthUserId, getRequiredParam } from '../lib/request';
import * as clientService from '../services/client.service';

export const listClients = async (req: Request, res: Response) => {
  return sendSuccess(res, await clientService.listClients(getAuthUserId(req)));
};

export const getClient = async (req: Request, res: Response) => {
  const client = await clientService.getClientById(getAuthUserId(req), getRequiredParam(req, 'id'));
  return client ? sendSuccess(res, client) : sendError(res, 'Client not found', 404);
};

export const createClient = async (req: Request, res: Response) => {
  return sendSuccess(res, await clientService.createClient(getAuthUserId(req), req.body), 201);
};

export const updateClient = async (req: Request, res: Response) => {
  const client = await clientService.updateClient(getAuthUserId(req), getRequiredParam(req, 'id'), req.body);
  return client ? sendSuccess(res, client) : sendError(res, 'Client not found', 404);
};
