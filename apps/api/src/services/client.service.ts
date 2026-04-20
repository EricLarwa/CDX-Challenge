import type { CreateClientInput, UpdateClientInput } from '@financeos/shared';

import { createPaginatedResult } from '../lib/pagination';
import { prisma } from '../lib/prisma';
import { serializeClient, serializeInvoice } from '../lib/serializers';

export const listClients = async (userId: string) => {
  const clients = await prisma.client.findMany({
    where: { userId, deletedAt: null },
    include: {
      invoices: {
        where: { deletedAt: null },
        include: {
          lineItems: true,
          payments: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return createPaginatedResult(
    clients.map((client) => ({
      ...serializeClient(client),
      totalInvoiced: client.invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0).toFixed(2),
      outstanding: client.invoices
        .reduce((sum, invoice) => sum + Number(invoice.total) - Number(invoice.amountPaid), 0)
        .toFixed(2),
    })),
    1,
    clients.length,
    clients.length,
  );
};

export const getClientById = async (userId: string, id: string) => {
  const client = await prisma.client.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      invoices: {
        where: { deletedAt: null },
        include: {
          lineItems: { orderBy: { sortOrder: 'asc' } },
          payments: { orderBy: { paidAt: 'asc' } },
        },
        orderBy: { issueDate: 'desc' },
      },
    },
  });

  if (!client) {
    return null;
  }

  return {
    ...serializeClient(client),
    invoices: client.invoices.map(serializeInvoice),
  };
};

export const createClient = async (userId: string, input: CreateClientInput) => {
  const client = await prisma.client.create({
    data: {
      user: { connect: { id: userId } },
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      paymentTerms: input.paymentTerms,
      notes: input.notes,
    },
  });

  return serializeClient(client);
};

export const updateClient = async (userId: string, id: string, input: UpdateClientInput) => {
  const existing = await prisma.client.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!existing) {
    return null;
  }

  const client = await prisma.client.update({
    where: { id },
    data: input,
  });

  return serializeClient(client);
};
