import { prisma } from '../../lib/prisma.js';

export type ExpenseAnomaly = {
  kind: 'duplicate_charge' | 'vendor_spike';
  message: string;
};

export const detectExpenseAnomalies = async (input: {
  userId: string;
  vendorId?: string | null;
  amount: number;
  date: string;
}) => {
  const anomalies: ExpenseAnomaly[] = [];

  if (!input.vendorId) {
    return anomalies;
  }

  const expenseDate = new Date(input.date);
  const windowStart = new Date(expenseDate);
  windowStart.setUTCDate(windowStart.getUTCDate() - 7);

  const recentExpenses = await prisma.expense.findMany({
    where: {
      userId: input.userId,
      vendorId: input.vendorId,
      deletedAt: null,
      date: {
        gte: windowStart,
        lte: expenseDate,
      },
    },
  });

  const duplicate = recentExpenses.find((expense) => Number(expense.amount) === input.amount);

  if (duplicate) {
    anomalies.push({
      kind: 'duplicate_charge',
      message: 'Same vendor and amount found within the last 7 days.',
    });
  }

  const average =
    recentExpenses.length > 0
      ? recentExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0) / recentExpenses.length
      : 0;

  if (average > 0 && input.amount > average * 2) {
    anomalies.push({
      kind: 'vendor_spike',
      message: "This expense is more than 2x the vendor's recent average.",
    });
  }

  return anomalies;
};
