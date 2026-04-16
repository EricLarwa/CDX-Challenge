export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD';

export type UserRecord = {
  id: string;
  email: string;
  businessName: string | null;
  currency: CurrencyCode | string;
  createdAt: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  paymentTerms: number;
  notes: string | null;
  createdAt: string;
};

export type VendorRecord = {
  id: string;
  name: string;
  category: string | null;
  email: string | null;
  notes: string | null;
  createdAt: string;
};

export type LineItemRecord = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
  sortOrder: number;
};

export type PaymentRecord = {
  id: string;
  amount: string;
  paidAt: string;
  method: string | null;
  notes: string | null;
};

export type InvoiceRecord = {
  id: string;
  clientId: string;
  invoiceNumber: string;
  status:
    | 'DRAFT'
    | 'SENT'
    | 'VIEWED'
    | 'PARTIALLY_PAID'
    | 'PAID'
    | 'OVERDUE'
    | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  amountPaid: string;
  notes: string | null;
  lineItems: LineItemRecord[];
  payments: PaymentRecord[];
};

export type ExpenseRecord = {
  id: string;
  vendorId: string | null;
  amount: string;
  category:
    | 'SOFTWARE'
    | 'TRAVEL'
    | 'MEALS'
    | 'EQUIPMENT'
    | 'CONTRACTORS'
    | 'UTILITIES'
    | 'MARKETING'
    | 'TAXES'
    | 'INSURANCE'
    | 'OTHER';
  description: string;
  date: string;
  isRecurring: boolean;
  receiptUrl: string | null;
  aiCategorized: boolean;
};
