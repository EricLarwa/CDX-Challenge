import { InvoiceStatus } from '@prisma/client';

import { HttpError } from '../lib/http-error';
import { prisma } from '../lib/prisma';

const parseDateParam = (value: string, label: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(`Invalid ${label} date`, 400);
  }

  return date;
};

const parseDateRange = (from: string, to: string) => {
  const start = parseDateParam(from, 'from');
  const end = parseDateParam(to, 'to');

  if (start > end) {
    throw new HttpError('The "from" date must be earlier than or equal to the "to" date', 400);
  }

  return { start, end };
};

export const getProfitAndLoss = async (userId: string, from: string, to: string) => {
  const { start, end } = parseDateRange(from, to);

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId, deletedAt: null, issueDate: { gte: start, lte: end } },
    }),
    prisma.expense.findMany({
      where: { userId, deletedAt: null, date: { gte: start, lte: end } },
    }),
  ]);

  const revenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return {
    from,
    to,
    revenue: revenue.toFixed(2),
    expenses: expenseTotal.toFixed(2),
    profit: (revenue - expenseTotal).toFixed(2),
  };
};

export const getCashFlowReport = async (userId: string, from: string, to: string) => {
  const { start, end } = parseDateRange(from, to);

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId, deletedAt: null, dueDate: { gte: start, lte: end }, status: { not: InvoiceStatus.CANCELLED } },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.expense.findMany({
      where: { userId, deletedAt: null, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const map = new Map<string, { period: string; inflow: number; outflow: number; net: number }>();

  for (const invoice of invoices) {
    const period = invoice.dueDate.toISOString().slice(0, 10);
    const entry = map.get(period) ?? { period, inflow: 0, outflow: 0, net: 0 };
    entry.inflow += Number(invoice.total) - Number(invoice.amountPaid);
    entry.net = entry.inflow - entry.outflow;
    map.set(period, entry);
  }

  for (const expense of expenses) {
    const period = expense.date.toISOString().slice(0, 10);
    const entry = map.get(period) ?? { period, inflow: 0, outflow: 0, net: 0 };
    entry.outflow += Number(expense.amount);
    entry.net = entry.inflow - entry.outflow;
    map.set(period, entry);
  }

  return Array.from(map.values()).sort((a, b) => a.period.localeCompare(b.period));
};

export const getAccountsReceivableAging = async (userId: string) => {
  const now = new Date();
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      deletedAt: null,
      status: { in: [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
    },
  });

  const buckets = {
    current: { bucket: 'current' as const, amount: 0, invoiceCount: 0 },
    '1_30': { bucket: '1_30' as const, amount: 0, invoiceCount: 0 },
    '31_60': { bucket: '31_60' as const, amount: 0, invoiceCount: 0 },
    '60_plus': { bucket: '60_plus' as const, amount: 0, invoiceCount: 0 },
  };

  for (const invoice of invoices) {
    const remaining = Number(invoice.total) - Number(invoice.amountPaid);
    const daysPastDue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const key =
      daysPastDue <= 0 ? 'current' : daysPastDue <= 30 ? '1_30' : daysPastDue <= 60 ? '31_60' : '60_plus';
    buckets[key].amount += remaining;
    buckets[key].invoiceCount += 1;
  }

  return {
    generatedAt: now.toISOString(),
    buckets: Object.values(buckets).map((bucket) => ({
      ...bucket,
      amount: bucket.amount.toFixed(2),
    })),
  };
};

export const getMonthlySummary = async (userId: string, year: number, month: number) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId, deletedAt: null, issueDate: { gte: start, lt: end } },
      include: { client: true },
    }),
    prisma.expense.findMany({
      where: { userId, deletedAt: null, date: { gte: start, lt: end } },
    }),
  ]);

  const revenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const clientTotals = new Map<string, number>();
  const categoryTotals = new Map<string, number>();

  for (const invoice of invoices) {
    clientTotals.set(invoice.client.name, (clientTotals.get(invoice.client.name) ?? 0) + Number(invoice.total));
  }

  for (const expense of expenses) {
    categoryTotals.set(expense.category, (categoryTotals.get(expense.category) ?? 0) + Number(expense.amount));
  }

  const topClient = [...clientTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topExpenseCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    year,
    month,
    revenue: revenue.toFixed(2),
    expenses: expenseTotal.toFixed(2),
    profit: (revenue - expenseTotal).toFixed(2),
    topClient,
    topExpenseCategory,
  };
};
