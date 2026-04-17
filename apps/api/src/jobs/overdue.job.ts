import cron from 'node-cron';
import { InvoiceStatus } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const runOverdueSweep = async () => {
  await prisma.invoice.updateMany({
    where: {
      deletedAt: null,
      dueDate: { lt: new Date() },
      status: { in: [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIALLY_PAID] },
    },
    data: {
      status: InvoiceStatus.OVERDUE,
    },
  });
};

export const startOverdueJob = () => cron.schedule('0 8 * * *', () => void runOverdueSweep());
