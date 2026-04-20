import type {
  AnalyzeExpenseInput,
  CategorizeExpenseInput,
  CreateExpenseInput,
  ExpenseQuery,
  UpdateExpenseInput,
} from '@financeos/shared';
import type { Prisma } from '@prisma/client';

import { decimal } from '../lib/money';
import { createPaginatedResult } from '../lib/pagination';
import { prisma } from '../lib/prisma';
import { serializeExpense } from '../lib/serializers';

import { detectExpenseAnomalies } from './ai/anomaly.service';
import { categorizeExpenseDescription } from './ai/categorize.service';

const normalizeExpenseQuery = (query: Partial<ExpenseQuery>): ExpenseQuery => ({
  page: Number.isFinite(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1,
  pageSize:
    Number.isFinite(Number(query.pageSize)) && Number(query.pageSize) > 0
      ? Math.min(100, Number(query.pageSize))
      : 20,
  ...(query.category ? { category: query.category } : {}),
  ...(query.vendorId ? { vendorId: query.vendorId } : {}),
  ...(query.from ? { from: query.from } : {}),
  ...(query.to ? { to: query.to } : {}),
  ...(query.amountMin ? { amountMin: query.amountMin } : {}),
  ...(query.amountMax ? { amountMax: query.amountMax } : {}),
});

export const listExpenses = async (userId: string, query: ExpenseQuery) => {
  const normalizedQuery = normalizeExpenseQuery(query);
  const where: Prisma.ExpenseWhereInput = {
    userId,
    deletedAt: null,
    ...(normalizedQuery.category ? { category: normalizedQuery.category } : {}),
    ...(normalizedQuery.vendorId ? { vendorId: normalizedQuery.vendorId } : {}),
    ...(normalizedQuery.from || normalizedQuery.to
      ? {
          date: {
            ...(normalizedQuery.from ? { gte: new Date(normalizedQuery.from) } : {}),
            ...(normalizedQuery.to ? { lte: new Date(normalizedQuery.to) } : {}),
          },
        }
      : {}),
    ...(normalizedQuery.amountMin || normalizedQuery.amountMax
      ? {
          amount: {
            ...(normalizedQuery.amountMin ? { gte: decimal(normalizedQuery.amountMin) } : {}),
            ...(normalizedQuery.amountMax ? { lte: decimal(normalizedQuery.amountMax) } : {}),
          },
        }
      : {}),
  };

  const [total, expenses] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (normalizedQuery.page - 1) * normalizedQuery.pageSize,
      take: normalizedQuery.pageSize,
    }),
  ]);

  return createPaginatedResult(expenses.map(serializeExpense), normalizedQuery.page, normalizedQuery.pageSize, total);
};

export const getExpenseById = async (userId: string, id: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId, deletedAt: null },
  });

  return expense ? serializeExpense(expense) : null;
};

export const createExpense = async (userId: string, input: CreateExpenseInput) => {
  const anomalies = await detectExpenseAnomalies({
    userId,
    vendorId: input.vendorId,
    amount: Number(input.amount),
    date: input.date,
  });

  if (anomalies.length) {
    console.warn('Expense anomalies detected:', anomalies);
  }

  const expense = await prisma.expense.create({
    data: {
      user: { connect: { id: userId } },
      ...(input.vendorId ? { vendor: { connect: { id: input.vendorId } } } : {}),
      amount: decimal(input.amount),
      category: input.category,
      description: input.description,
      date: new Date(input.date),
      isRecurring: input.isRecurring,
      receiptUrl: input.receiptUrl,
    },
  });

  return serializeExpense(expense);
};

export const updateExpense = async (userId: string, id: string, input: UpdateExpenseInput) => {
  const existing = await prisma.expense.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    return null;
  }

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      ...(input.vendorId !== undefined ? { vendor: { connect: { id: input.vendorId } } } : {}),
      ...(input.amount ? { amount: decimal(input.amount) } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.date ? { date: new Date(input.date) } : {}),
      ...(input.isRecurring !== undefined ? { isRecurring: input.isRecurring } : {}),
      ...(input.receiptUrl !== undefined ? { receiptUrl: input.receiptUrl } : {}),
    },
  });

  return serializeExpense(expense);
};

export const deleteExpense = async (userId: string, id: string) => {
  const existing = await prisma.expense.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    return false;
  }

  await prisma.expense.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

export const categorizeExpense = async (input: CategorizeExpenseInput) => {
  return categorizeExpenseDescription(input.description);
};

export const analyzeExpense = async (userId: string, input: AnalyzeExpenseInput) => {
  const anomalies = await detectExpenseAnomalies({
    userId,
    vendorId: input.vendorId,
    amount: Number(input.amount),
    date: input.date,
  });

  return { anomalies };
};
