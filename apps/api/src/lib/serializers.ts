import type {
  ClientRecord,
  ExpenseRecord,
  InvoiceRecord,
  PaymentRecord,
  UserRecord,
  VendorRecord,
} from '@financeos/shared';
import type { Client, Expense, Invoice, LineItem, Payment, User, Vendor } from '@prisma/client';

export const serializeUser = (user: User): UserRecord => ({
  id: user.id,
  email: user.email,
  businessName: user.businessName,
  currency: user.currency,
  createdAt: user.createdAt.toISOString(),
});

export const serializeClient = (client: Client): ClientRecord => ({
  id: client.id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  address: client.address,
  paymentTerms: client.paymentTerms,
  notes: client.notes,
  createdAt: client.createdAt.toISOString(),
});

export const serializeVendor = (vendor: Vendor): VendorRecord => ({
  id: vendor.id,
  name: vendor.name,
  category: vendor.category,
  email: vendor.email,
  notes: vendor.notes,
  createdAt: vendor.createdAt.toISOString(),
});

export const serializePayment = (payment: Payment): PaymentRecord => ({
  id: payment.id,
  amount: payment.amount.toFixed(2),
  paidAt: payment.paidAt.toISOString(),
  method: payment.method,
  notes: payment.notes,
});

export const serializeInvoice = (
  invoice: Invoice & { lineItems: LineItem[]; payments: Payment[] },
): InvoiceRecord => ({
  id: invoice.id,
  clientId: invoice.clientId,
  invoiceNumber: invoice.invoiceNumber,
  status: invoice.status,
  issueDate: invoice.issueDate.toISOString(),
  dueDate: invoice.dueDate.toISOString(),
  subtotal: invoice.subtotal.toFixed(2),
  taxRate: invoice.taxRate.toFixed(2),
  taxAmount: invoice.taxAmount.toFixed(2),
  total: invoice.total.toFixed(2),
  amountPaid: invoice.amountPaid.toFixed(2),
  notes: invoice.notes,
  lineItems: invoice.lineItems.map((lineItem) => ({
    id: lineItem.id,
    description: lineItem.description,
    quantity: lineItem.quantity.toFixed(2),
    unitPrice: lineItem.unitPrice.toFixed(2),
    total: lineItem.total.toFixed(2),
    sortOrder: lineItem.sortOrder,
  })),
  payments: invoice.payments.map(serializePayment),
});

export const serializeExpense = (expense: Expense): ExpenseRecord => ({
  id: expense.id,
  vendorId: expense.vendorId,
  amount: expense.amount.toFixed(2),
  category: expense.category,
  description: expense.description,
  date: expense.date.toISOString(),
  isRecurring: expense.isRecurring,
  receiptUrl: expense.receiptUrl,
  aiCategorized: expense.aiCategorized,
});
