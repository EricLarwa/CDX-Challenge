import type {
  AccountsReceivableAgingReport,
  ClientRecord,
  DashboardPayload,
  ExpenseRecord,
  InvoiceRecord,
  MonthlySummaryReport,
  PaginatedResult,
  ProfitAndLossReport,
  UserRecord,
  VendorRecord,
} from '@financeos/shared';

export const mockUser: UserRecord = {
  id: 'usr_demo',
  email: 'demo@financeos.app',
  businessName: 'Northstar Studio',
  currency: 'USD',
  createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
};

export const mockClients: ClientRecord[] = [
  {
    id: 'cli_atlas',
    name: 'Atlas Creative',
    email: 'finance@atlascreative.co',
    phone: null,
    address: null,
    paymentTerms: 15,
    notes: 'Prefers ACH payments.',
    createdAt: new Date('2026-01-02T00:00:00.000Z').toISOString(),
  },
  {
    id: 'cli_pine',
    name: 'Pine & Peak Builders',
    email: 'ops@pinepeakbuild.com',
    phone: null,
    address: null,
    paymentTerms: 30,
    notes: null,
    createdAt: new Date('2026-01-03T00:00:00.000Z').toISOString(),
  },
];

export const mockVendors: VendorRecord[] = [
  {
    id: 'ven_linear',
    name: 'Linear',
    category: 'Software',
    email: 'billing@linear.app',
    notes: null,
    createdAt: new Date('2026-01-04T00:00:00.000Z').toISOString(),
  },
  {
    id: 'ven_figma',
    name: 'Figma',
    category: 'Software',
    email: 'accounts@figma.com',
    notes: null,
    createdAt: new Date('2026-01-05T00:00:00.000Z').toISOString(),
  },
];

export const mockInvoices: InvoiceRecord[] = [
  {
    id: 'inv_1',
    clientId: 'cli_atlas',
    clientName: 'Atlas Creative',
    invoiceNumber: 'INV-2026-0001',
    status: 'PAID',
    issueDate: new Date('2026-03-01T00:00:00.000Z').toISOString(),
    dueDate: new Date('2026-03-15T00:00:00.000Z').toISOString(),
    subtotal: '3000.00',
    taxRate: '8.25',
    taxAmount: '247.50',
    total: '3247.50',
    amountPaid: '3247.50',
    notes: 'Brand strategy retainer',
    lineItems: [
      {
        id: 'li_1',
        description: 'Brand strategy workshop',
        quantity: '1.00',
        unitPrice: '3000.00',
        total: '3000.00',
        sortOrder: 0,
      },
    ],
    payments: [
      {
        id: 'pay_1',
        amount: '3247.50',
        paidAt: new Date('2026-03-09T00:00:00.000Z').toISOString(),
        method: 'ACH',
        notes: null,
      },
    ],
  },
  {
    id: 'inv_2',
    clientId: 'cli_pine',
    clientName: 'Pine & Peak Builders',
    invoiceNumber: 'INV-2026-0002',
    status: 'OVERDUE',
    issueDate: new Date('2026-04-01T00:00:00.000Z').toISOString(),
    dueDate: new Date('2026-04-10T00:00:00.000Z').toISOString(),
    subtotal: '1800.00',
    taxRate: '0.00',
    taxAmount: '0.00',
    total: '1800.00',
    amountPaid: '0.00',
    notes: 'Website sprint 1',
    lineItems: [
      {
        id: 'li_2',
        description: 'Design system implementation',
        quantity: '12.00',
        unitPrice: '150.00',
        total: '1800.00',
        sortOrder: 0,
      },
    ],
    payments: [],
  },
];

export const mockExpenses: ExpenseRecord[] = [
  {
    id: 'exp_1',
    vendorId: 'ven_linear',
    amount: '39.00',
    category: 'SOFTWARE',
    description: 'Linear workspace subscription',
    date: new Date('2026-04-01T00:00:00.000Z').toISOString(),
    isRecurring: true,
    receiptUrl: null,
    aiCategorized: false,
  },
  {
    id: 'exp_2',
    vendorId: 'ven_figma',
    amount: '89.00',
    category: 'SOFTWARE',
    description: 'Figma professional plan',
    date: new Date('2026-04-03T00:00:00.000Z').toISOString(),
    isRecurring: true,
    receiptUrl: null,
    aiCategorized: false,
  },
];

export const mockDashboard: DashboardPayload = {
  healthScore: {
    score: 82,
    label: 'Strong',
    drivers: ['Low overdue balance', 'Healthy inflow trend', 'Controlled recurring software costs'],
  },
  summary: {
    revenueMTD: '3247.50',
    expensesMTD: '128.00',
    outstanding: '1800.00',
    overdue: '1800.00',
  },
  cashFlow: [
    { period: 'Week 1', inflow: 3247.5, outflow: 128, net: 3119.5 },
    { period: 'Week 2', inflow: 0, outflow: 0, net: 0 },
    { period: 'Week 3', inflow: 1800, outflow: 89, net: 1711 },
  ],
  alerts: [
    {
      id: 'alert_1',
      type: 'overdue_invoice',
      title: '1 overdue invoice needs follow-up',
      description: 'Pine & Peak Builders has an invoice 6 days past due.',
      actionLabel: 'Review invoice',
    },
  ],
};

export const mockPnl: ProfitAndLossReport = {
  from: new Date('2026-04-01T00:00:00.000Z').toISOString(),
  to: new Date('2026-04-30T23:59:59.000Z').toISOString(),
  revenue: '3247.50',
  expenses: '128.00',
  profit: '3119.50',
};

export const mockArAging: AccountsReceivableAgingReport = {
  generatedAt: new Date().toISOString(),
  buckets: [
    { bucket: 'current', amount: '0.00', invoiceCount: 0 },
    { bucket: '1_30', amount: '1800.00', invoiceCount: 1 },
    { bucket: '31_60', amount: '0.00', invoiceCount: 0 },
    { bucket: '60_plus', amount: '0.00', invoiceCount: 0 },
  ],
};

export const mockMonthlySummary: MonthlySummaryReport = {
  year: 2026,
  month: 4,
  revenue: '3247.50',
  expenses: '128.00',
  profit: '3119.50',
  topClient: 'Atlas Creative',
  topExpenseCategory: 'SOFTWARE',
};

export const toPaginated = <T>(items: T[]): PaginatedResult<T> => ({
  items,
  page: 1,
  pageSize: items.length,
  total: items.length,
});
