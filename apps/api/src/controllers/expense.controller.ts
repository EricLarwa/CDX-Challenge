import type { Request, Response } from 'express';

import { sendError, sendSuccess } from '../lib/api-response.js';
import { getAuthUserId, getRequiredParam } from '../lib/request.js';
import * as expenseService from '../services/expense.service.js';

export const listExpenses = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.listExpenses(getAuthUserId(req), req.query as never));
};

export const getExpense = async (req: Request, res: Response) => {
  const expense = await expenseService.getExpenseById(getAuthUserId(req), getRequiredParam(req, 'id'));
  return expense ? sendSuccess(res, expense) : sendError(res, 'Expense not found', 404);
};

export const createExpense = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.createExpense(getAuthUserId(req), req.body), 201);
};

export const updateExpense = async (req: Request, res: Response) => {
  const expense = await expenseService.updateExpense(getAuthUserId(req), getRequiredParam(req, 'id'), req.body);
  return expense ? sendSuccess(res, expense) : sendError(res, 'Expense not found', 404);
};

export const deleteExpense = async (req: Request, res: Response) => {
  const deleted = await expenseService.deleteExpense(getAuthUserId(req), getRequiredParam(req, 'id'));
  return deleted ? sendSuccess(res, { deleted: true }) : sendError(res, 'Expense not found', 404);
};

export const categorizeExpense = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.categorizeExpense(req.body), 201);
};

export const analyzeExpense = async (req: Request, res: Response) => {
  return sendSuccess(res, await expenseService.analyzeExpense(getAuthUserId(req), req.body), 200);
};
