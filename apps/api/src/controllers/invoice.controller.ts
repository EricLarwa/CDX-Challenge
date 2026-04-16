import type { Request, Response } from 'express';

import { sendError, sendSuccess } from '../lib/api-response';
import { getAuthUserId, getRequiredParam } from '../lib/request';
import * as invoiceService from '../services/invoice.service';

export const listInvoices = async (req: Request, res: Response) => {
  return sendSuccess(res, await invoiceService.listInvoices(getAuthUserId(req), req.query as never));
};

export const getInvoice = async (req: Request, res: Response) => {
  const invoice = await invoiceService.getInvoiceById(getAuthUserId(req), getRequiredParam(req, 'id'));
  return invoice ? sendSuccess(res, invoice) : sendError(res, 'Invoice not found', 404);
};

export const createInvoice = async (req: Request, res: Response) => {
  return sendSuccess(res, await invoiceService.createInvoice(getAuthUserId(req), req.body), 201);
};

export const updateInvoice = async (req: Request, res: Response) => {
  const invoice = await invoiceService.updateInvoice(getAuthUserId(req), getRequiredParam(req, 'id'), req.body);
  return invoice ? sendSuccess(res, invoice) : sendError(res, 'Invoice not found', 404);
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const deleted = await invoiceService.deleteInvoice(getAuthUserId(req), getRequiredParam(req, 'id'));
  return deleted ? sendSuccess(res, { deleted: true }) : sendError(res, 'Invoice not found', 404);
};

export const sendInvoice = async (req: Request, res: Response) => {
  const invoice = await invoiceService.sendInvoice(getAuthUserId(req), getRequiredParam(req, 'id'));
  return invoice ? sendSuccess(res, invoice) : sendError(res, 'Invoice not found', 404);
};

export const recordPayment = async (req: Request, res: Response) => {
  const invoice = await invoiceService.recordPayment(getAuthUserId(req), getRequiredParam(req, 'id'), req.body);
  return invoice ? sendSuccess(res, invoice, 201) : sendError(res, 'Invoice not found', 404);
};

export const getInvoicePdf = async (req: Request, res: Response) => {
  const invoice = await invoiceService.getInvoiceById(getAuthUserId(req), getRequiredParam(req, 'id'));
  return invoice
    ? sendSuccess(res, { invoiceId: invoice.id, downloadUrl: `/api/v1/invoices/${invoice.id}/pdf` })
    : sendError(res, 'Invoice not found', 404);
};
