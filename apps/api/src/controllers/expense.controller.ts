import type { Request, Response } from 'express';

import { sendError, sendSuccess } from '../lib/api-response';
import { getRequiredParam } from '../lib/request';
import * as expenseService from '../services/expense.service';

export const listExpenses = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.listExpenses(req.query as never));
};

export const getExpense = async (req: Request, res: Response) => {
  const expense = await expenseService.getExpenseById(getRequiredParam(req, 'id'));
  return expense ? sendSuccess(res, expense) : sendError(res, 'Expense not found', 404);
};

export const createExpense = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.createExpense(req.body), 201);
};

export const updateExpense = async (req: Request, res: Response) => {
  const expense = await expenseService.updateExpense(getRequiredParam(req, 'id'), req.body);
  return expense ? sendSuccess(res, expense) : sendError(res, 'Expense not found', 404);
};

export const deleteExpense = async (_req: Request, res: Response) => {
  return sendSuccess(res, { deleted: true });
};

export const categorizeExpense = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.categorizeExpense(req.body), 201);
};
