import type { CreateInvoiceInput, CreatePaymentInput, InvoiceQuery, UpdateInvoiceInput } from '@financeos/shared';
import type { Prisma } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';

import { HttpError } from '../lib/http-error';
import { decimal, sumDecimals } from '../lib/money';
import { createPaginatedResult } from '../lib/pagination';
import { prisma } from '../lib/prisma';
import { serializeInvoice } from '../lib/serializers';

import { sendInvoiceDeliveryEmail, sendPaymentReceivedEmail } from './email/email.service';

const invoiceInclude = {
  client: true,
  lineItems: { orderBy: { sortOrder: 'asc' as const } },
  payments: { orderBy: { paidAt: 'asc' as const } },
};

const calculateInvoiceTotals = (input: Pick<CreateInvoiceInput, 'lineItems' | 'taxRate'>) => {
  const items = input.lineItems.map((lineItem) => {
    const quantity = decimal(lineItem.quantity);
    const unitPrice = decimal(lineItem.unitPrice);
    const total = quantity.mul(unitPrice);

    return {
      ...lineItem,
      quantity,
      unitPrice,
      total,
    };
  });

  const subtotal = sumDecimals(items.map((item) => item.total));
  const taxRate = decimal(input.taxRate);
  const taxAmount = subtotal.mul(taxRate).div(100).toDecimalPlaces(2);
  const total = subtotal.plus(taxAmount);

  return { items, subtotal, taxRate, taxAmount, total };
};

const buildInvoiceNumber = async (userId: string) => {
  const year = new Date().getUTCFullYear();
  const count = await prisma.invoice.count({
    where: {
      userId,
      deletedAt: null,
      invoiceNumber: {
        startsWith: `INV-${year}-`,
      },
    },
  });

  return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
};

export const listInvoices = async (userId: string, query: InvoiceQuery) => {
  const where: Prisma.InvoiceWhereInput = {
    userId,
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.clientId ? { clientId: query.clientId } : {}),
    ...(query.search
      ? {
          OR: [
            { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
            { client: { name: { contains: query.search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  const [total, invoices] = await Promise.all([
    prisma.invoice.count({ where }),
    prisma.invoice.findMany({
      where,
      include: invoiceInclude,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return createPaginatedResult(
    invoices.map(serializeInvoice),
    query.page,
    query.pageSize,
    total,
  );
};

export const getInvoiceById = async (userId: string, id: string) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
    include: invoiceInclude,
  });

  return invoice ? serializeInvoice(invoice) : null;
};

export const createInvoice = async (userId: string, input: CreateInvoiceInput) => {
  const client = await prisma.client.findFirst({
    where: { id: input.clientId, userId, deletedAt: null },
  });

  if (!client) {
    throw new HttpError('Client not found', 404);
  }

  const totals = calculateInvoiceTotals(input);
  const invoiceNumber = await buildInvoiceNumber(userId);

  const invoice = await prisma.invoice.create({
    data: {
      userId,
      clientId: input.clientId,
      invoiceNumber,
      issueDate: new Date(input.issueDate),
      dueDate: new Date(input.dueDate),
      subtotal: totals.subtotal,
      taxRate: totals.taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      notes: input.notes,
      lineItems: {
        create: totals.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          sortOrder: item.sortOrder,
        })),
      },
    },
    include: invoiceInclude,
  });

  return serializeInvoice(invoice);
};

export const updateInvoice = async (userId: string, id: string, input: UpdateInvoiceInput) => {
  const existing = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
    include: invoiceInclude,
  });

  if (!existing) {
    return null;
  }

  const result = await prisma.$transaction(async (tx) => {
    const invoiceData: Prisma.InvoiceUpdateInput = {
      ...(input.clientId ? { client: { connect: { id: input.clientId } } } : {}),
      ...(input.issueDate ? { issueDate: new Date(input.issueDate) } : {}),
      ...(input.dueDate ? { dueDate: new Date(input.dueDate) } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.status ? { status: input.status } : {}),
    };

    if (input.lineItems || input.taxRate) {
      const totals = calculateInvoiceTotals({
        lineItems: input.lineItems ?? existing.lineItems.map((lineItem) => ({
          description: lineItem.description,
          quantity: lineItem.quantity.toFixed(2),
          unitPrice: lineItem.unitPrice.toFixed(2),
          sortOrder: lineItem.sortOrder,
        })),
        taxRate: input.taxRate ?? existing.taxRate.toFixed(2),
      });

      invoiceData.subtotal = totals.subtotal;
      invoiceData.taxRate = totals.taxRate;
      invoiceData.taxAmount = totals.taxAmount;
      invoiceData.total = totals.total;

      await tx.lineItem.deleteMany({ where: { invoiceId: id } });
      invoiceData.lineItems = {
        create: totals.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          sortOrder: item.sortOrder,
        })),
      };
    }

    if (input.status === InvoiceStatus.PAID) {
      invoiceData.amountPaid = existing.total;
    }

    return tx.invoice.update({
      where: { id },
      data: invoiceData,
      include: invoiceInclude,
    });
  });

  return serializeInvoice(result);
};

export const deleteInvoice = async (userId: string, id: string) => {
  const existing = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    return false;
  }

  await prisma.invoice.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

export const cancelInvoice = async (userId: string, id: string) => {
  const existing = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
    include: invoiceInclude,
  });

  if (!existing) {
    return null;
  }

  if (Number(existing.amountPaid) > 0) {
    throw new HttpError('Cannot cancel an invoice that already has payments', 400);
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: InvoiceStatus.CANCELLED },
    include: invoiceInclude,
  });

  return serializeInvoice(invoice);
};

export const recordPayment = async (userId: string, id: string, input: CreatePaymentInput) => {
  const existing = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
    include: invoiceInclude,
  });

  if (!existing) {
    return null;
  }

  const paymentAmount = decimal(input.amount);
  const amountPaid = existing.amountPaid.plus(paymentAmount);
  const status = amountPaid.greaterThanOrEqualTo(existing.total)
    ? InvoiceStatus.PAID
    : InvoiceStatus.PARTIALLY_PAID;

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      amountPaid,
      status,
      payments: {
        create: {
          amount: paymentAmount,
          paidAt: new Date(input.paidAt),
          method: input.method,
          notes: input.notes,
        },
      },
    },
    include: invoiceInclude,
  });

  const client = await prisma.client.findFirst({
    where: { id: invoice.clientId, userId, deletedAt: null },
  });

  if (client?.email) {
    await sendPaymentReceivedEmail({
      to: client.email,
      clientName: client.name,
      invoiceNumber: invoice.invoiceNumber,
      amount: paymentAmount.toFixed(2),
    });
  }

  return serializeInvoice(invoice);
};

export const sendInvoice = async (userId: string, id: string) => {
  const existing = await prisma.invoice.findFirst({
    where: { id, userId, deletedAt: null },
    include: invoiceInclude,
  });

  if (!existing) {
    return null;
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      status: existing.status === InvoiceStatus.DRAFT ? InvoiceStatus.SENT : existing.status,
    },
    include: invoiceInclude,
  });

  if (existing.client.email) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await sendInvoiceDeliveryEmail({
      to: existing.client.email,
      businessName: user?.businessName ?? 'FinanceOS',
      clientName: existing.client.name,
      invoiceNumber: existing.invoiceNumber,
      total: existing.total.toFixed(2),
    });
  }

  return serializeInvoice(invoice);
};
