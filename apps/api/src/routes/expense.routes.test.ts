import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listExpensesMock = vi.fn();
const getExpenseByIdMock = vi.fn();
const createExpenseMock = vi.fn();
const updateExpenseMock = vi.fn();
const deleteExpenseMock = vi.fn();
const categorizeExpenseMock = vi.fn();
const analyzeExpenseMock = vi.fn();

vi.mock('../services/expense.service', () => ({
  listExpenses: listExpensesMock,
  getExpenseById: getExpenseByIdMock,
  createExpense: createExpenseMock,
  updateExpense: updateExpenseMock,
  deleteExpense: deleteExpenseMock,
  categorizeExpense: categorizeExpenseMock,
  analyzeExpense: analyzeExpenseMock,
}));

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    auth: {
      userId: 'usr_test',
      email: 'test@example.com',
    },
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as Request;
}

function createMockResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;

  (response.status as unknown as ReturnType<typeof vi.fn>).mockReturnValue(response);
  (response.json as unknown as ReturnType<typeof vi.fn>).mockReturnValue(response);

  return response;
}

describe('expense routes', () => {
  beforeEach(() => {
    listExpensesMock.mockReset();
    getExpenseByIdMock.mockReset();
    createExpenseMock.mockReset();
    updateExpenseMock.mockReset();
    deleteExpenseMock.mockReset();
    categorizeExpenseMock.mockReset();
    analyzeExpenseMock.mockReset();
  });

  it('categorizes an expense description', async () => {
    categorizeExpenseMock.mockResolvedValue({ category: 'SOFTWARE', source: 'ai' });
    const req = createMockRequest({
      body: {
        description: 'Linear annual subscription',
      },
    });
    const res = createMockResponse();
    const controller = await import('../controllers/expense.controller');

    await controller.categorizeExpense(req, res);

    expect(categorizeExpenseMock).toHaveBeenCalledWith({ description: 'Linear annual subscription' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { category: 'SOFTWARE', source: 'ai' },
    });
  });

  it('returns anomaly analysis for an expense draft', async () => {
    analyzeExpenseMock.mockResolvedValue({
      anomalies: [{ kind: 'duplicate_charge', message: 'Same vendor and amount found within the last 7 days.' }],
    });
    const req = createMockRequest({
      body: {
        vendorId: 'c12345678901234567890123',
        amount: '120.00',
        date: '2026-04-16T00:00:00.000Z',
      },
    });
    const res = createMockResponse();
    const controller = await import('../controllers/expense.controller');

    await controller.analyzeExpense(req, res);

    expect(analyzeExpenseMock).toHaveBeenCalledWith('usr_test', {
      vendorId: 'c12345678901234567890123',
      amount: '120.00',
      date: '2026-04-16T00:00:00.000Z',
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
