import type { CreateInvoiceInput, CreatePaymentInput, InvoiceQuery, InvoiceRecord, UpdateInvoiceInput } from '@financeos/shared';

import { mockInvoices, toPaginated } from '../lib/mock-data';

export const listInvoices = async (_query: InvoiceQuery) => toPaginated(mockInvoices);

export const getInvoiceById = async (id: string) => mockInvoices.find((invoice) => invoice.id === id) ?? null;

export const createInvoice = async (input: CreateInvoiceInput): Promise<InvoiceRecord> => {
  return {
    id: 'inv_new',
    clientId: input.clientId,
    invoiceNumber: 'INV-2026-0999',
    status: 'DRAFT',
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    subtotal: '0.00',
    taxRate: input.taxRate,
    taxAmount: '0.00',
    total: '0.00',
    amountPaid: '0.00',
    notes: input.notes ?? null,
    lineItems: input.lineItems.map((lineItem, index) => ({
      id: `li_new_${index}`,
      description: lineItem.description,
      quantity: lineItem.quantity,
      unitPrice: lineItem.unitPrice,
      total: '0.00',
      sortOrder: lineItem.sortOrder,
    })),
    payments: [],
  };
};

export const updateInvoice = async (id: string, input: UpdateInvoiceInput) => {
  const existing = mockInvoices.find((invoice) => invoice.id === id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    status: input.status ?? existing.status,
    notes: input.notes ?? existing.notes,
  };
};

export const recordPayment = async (id: string, input: CreatePaymentInput) => {
  const existing = mockInvoices.find((invoice) => invoice.id === id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    amountPaid: input.amount,
    status: 'PARTIALLY_PAID' as const,
    payments: [
      ...existing.payments,
      {
        id: `pay_${existing.payments.length + 1}`,
        amount: input.amount,
        paidAt: input.paidAt,
        method: input.method ?? null,
        notes: input.notes ?? null,
      },
    ],
  };
};

export const sendInvoice = async (id: string) => {
  const existing = mockInvoices.find((invoice) => invoice.id === id);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    status: 'SENT' as const,
  };
};
