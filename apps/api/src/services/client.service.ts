import type { ClientRecord } from '@financeos/shared';

import { mockClients, mockInvoices, toPaginated } from '../lib/mock-data';

export const listClients = async () => {
  const items = mockClients.map((client) => ({
    ...client,
    outstanding: mockInvoices
      .filter((invoice) => invoice.clientId === client.id)
      .reduce((sum, invoice) => sum + Number(invoice.total) - Number(invoice.amountPaid), 0)
      .toFixed(2),
  }));

  return toPaginated(items);
};

export const getClientById = async (id: string) => {
  const client = mockClients.find((item) => item.id === id);
  if (!client) {
    return null;
  }

  return {
    ...client,
    invoices: mockInvoices.filter((invoice) => invoice.clientId === id),
  };
};

export const createClient = async (input: Omit<ClientRecord, 'id' | 'createdAt'>) => ({
  id: 'cli_new',
  createdAt: new Date().toISOString(),
  ...input,
});
