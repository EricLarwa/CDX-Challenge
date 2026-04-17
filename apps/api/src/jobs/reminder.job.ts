import cron from 'node-cron';

import { prisma } from '../lib/prisma';
import { sendPaymentReminderEmail } from '../services/email/email.service';

export const runReminderSweep = async () => {
  const reminderDate = new Date();
  reminderDate.setUTCDate(reminderDate.getUTCDate() + 3);
  const start = new Date(Date.UTC(reminderDate.getUTCFullYear(), reminderDate.getUTCMonth(), reminderDate.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const invoices = await prisma.invoice.findMany({
    where: {
      deletedAt: null,
      dueDate: { gte: start, lt: end },
      client: { email: { not: null } },
    },
    include: { client: true },
  });

  await Promise.all(
    invoices.map((invoice) =>
      sendPaymentReminderEmail({
        to: invoice.client.email ?? '',
        clientName: invoice.client.name,
        invoiceNumber: invoice.invoiceNumber,
        dueDate: invoice.dueDate.toLocaleDateString(),
        remaining: (Number(invoice.total) - Number(invoice.amountPaid)).toFixed(2),
      }),
    ),
  );
};

export const startReminderJob = () => cron.schedule('0 8 * * *', () => void runReminderSweep());
