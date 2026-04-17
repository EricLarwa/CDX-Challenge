import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listExpensesMock = vi.fn();
const getExpenseByIdMock = vi.fn();
const createExpenseMock = vi.fn();
const updateExpenseMock = vi.fn();
const deleteExpenseMock = vi.fn();
const categorizeExpenseMock = vi.fn();
const analyzeExpenseMock = vi.fn();

vi.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    (req as express.Request & { user: { userId: string; email: string } }).user = {
      userId: 'usr_test',
      email: 'test@example.com',
    };
    next();
  },
}));

vi.mock('../services/expense.service', () => ({
  listExpenses: listExpensesMock,
  getExpenseById: getExpenseByIdMock,
  createExpense: createExpenseMock,
  updateExpense: updateExpenseMock,
  deleteExpense: deleteExpenseMock,
  categorizeExpense: categorizeExpenseMock,
  analyzeExpense: analyzeExpenseMock,
}));

describe('expense routes', () => {
  let app: express.Express;

  beforeEach(async () => {
    listExpensesMock.mockReset();
    getExpenseByIdMock.mockReset();
    createExpenseMock.mockReset();
    updateExpenseMock.mockReset();
    deleteExpenseMock.mockReset();
    categorizeExpenseMock.mockReset();
    analyzeExpenseMock.mockReset();

    app = express();
    app.use(express.json());

    const { default: expenseRoutes } = await import('./expense.routes');
    app.use('/expenses', expenseRoutes);
  });

  it('categorizes an expense description', async () => {
    categorizeExpenseMock.mockResolvedValue({ category: 'SOFTWARE', source: 'ai' });

    const response = await request(app).post('/expenses/categorize').send({
      description: 'Linear annual subscription',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.category).toBe('SOFTWARE');
    expect(categorizeExpenseMock).toHaveBeenCalledWith({ description: 'Linear annual subscription' });
  });

  it('returns anomaly analysis for an expense draft', async () => {
    analyzeExpenseMock.mockResolvedValue({
      anomalies: [{ kind: 'duplicate_charge', message: 'Same vendor and amount found within the last 7 days.' }],
    });

    const response = await request(app).post('/expenses/analyze').send({
      vendorId: 'c12345678901234567890123',
      amount: '120.00',
      date: '2026-04-16T00:00:00.000Z',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.anomalies).toHaveLength(1);
    expect(analyzeExpenseMock).toHaveBeenCalledWith('usr_test', {
      vendorId: 'c12345678901234567890123',
      amount: '120.00',
      date: '2026-04-16T00:00:00.000Z',
    });
  });
});
