import type { DashboardPayload } from '@financeos/shared';
import { InvoiceStatus } from '@prisma/client';


import { prisma } from '../lib/prisma';

export const getDashboard = async (userId: string): Promise<DashboardPayload> => {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId, deletedAt: null },
      include: { client: true },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.expense.findMany({
      where: { userId, deletedAt: null },
      orderBy: { date: 'asc' },
    }),
  ]);

  const revenueMTD = invoices
    .filter((invoice) => invoice.issueDate >= monthStart && invoice.issueDate < nextMonth)
    .reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const expensesMTD = expenses
    .filter((expense) => expense.date >= monthStart && expense.date < nextMonth)
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
  const outstanding = invoices.reduce((sum, invoice) => sum + Number(invoice.total) - Number(invoice.amountPaid), 0);
  const overdueInvoices = invoices.filter((invoice) => invoice.status === InvoiceStatus.OVERDUE);
  const overdue = overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.total) - Number(invoice.amountPaid), 0);

  const healthBase = 100 - Math.min(40, overdueInvoices.length * 15) - Math.min(20, Math.round(expensesMTD / 200));
  const healthScore = Math.max(35, healthBase);

  return {
    healthScore: {
      score: healthScore,
      label: healthScore >= 80 ? 'Strong' : healthScore >= 60 ? 'Stable' : 'At Risk',
      drivers: [
        `${overdueInvoices.length} overdue invoice(s) detected`,
        `MTD expenses are ${expensesMTD.toFixed(2)}`,
        `Outstanding receivables total ${outstanding.toFixed(2)}`,
      ],
    },
    summary: {
      revenueMTD: revenueMTD.toFixed(2),
      expensesMTD: expensesMTD.toFixed(2),
      outstanding: outstanding.toFixed(2),
      overdue: overdue.toFixed(2),
    },
    cashFlow: Array.from({ length: 3 }).map((_, index) => {
      const label = `Window ${index + 1}`;
      const inflow = invoices.slice(index, index + 2).reduce((sum, invoice) => sum + Number(invoice.total), 0);
      const outflow = expenses.slice(index, index + 2).reduce((sum, expense) => sum + Number(expense.amount), 0);
      return { period: label, inflow, outflow, net: inflow - outflow };
    }),
    alerts: overdueInvoices.slice(0, 3).map((invoice) => ({
      id: invoice.id,
      type: 'overdue_invoice' as const,
      title: `${invoice.invoiceNumber} is overdue`,
      description: `${invoice.client.name} has ${(Number(invoice.total) - Number(invoice.amountPaid)).toFixed(2)} outstanding.`,
      actionLabel: 'Review invoice',
    })),
  };
};
