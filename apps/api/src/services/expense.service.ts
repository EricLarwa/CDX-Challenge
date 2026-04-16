import type { CategorizeExpenseInput, CreateExpenseInput, ExpenseQuery, UpdateExpenseInput } from '@financeos/shared';
import type { Prisma } from '@prisma/client';


import { decimal } from '../lib/money';
import { createPaginatedResult } from '../lib/pagination';
import { prisma } from '../lib/prisma';
import { serializeExpense } from '../lib/serializers';

export const listExpenses = async (userId: string, query: ExpenseQuery) => {
  const where: Prisma.ExpenseWhereInput = {
    userId,
    deletedAt: null,
    ...(query.category ? { category: query.category } : {}),
    ...(query.vendorId ? { vendorId: query.vendorId } : {}),
    ...(query.from || query.to
      ? {
          date: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          },
        }
      : {}),
  };

  const [total, expenses] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return createPaginatedResult(expenses.map(serializeExpense), query.page, query.pageSize, total);
};

export const getExpenseById = async (userId: string, id: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId, deletedAt: null },
  });

  return expense ? serializeExpense(expense) : null;
};

export const createExpense = async (userId: string, input: CreateExpenseInput) => {
  const expense = await prisma.expense.create({
    data: {
      userId,
      vendorId: input.vendorId,
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
      ...(input.vendorId !== undefined ? { vendorId: input.vendorId } : {}),
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
  const normalized = input.description.toLowerCase();

  if (normalized.includes('flight') || normalized.includes('hotel') || normalized.includes('train')) {
    return { category: 'TRAVEL' as const };
  }

  if (normalized.includes('figma') || normalized.includes('linear') || normalized.includes('software')) {
    return { category: 'SOFTWARE' as const };
  }

  if (normalized.includes('meal') || normalized.includes('dinner') || normalized.includes('lunch')) {
    return { category: 'MEALS' as const };
  }

  return { category: 'OTHER' as const };
};
