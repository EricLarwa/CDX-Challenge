export type ProfitAndLossReport = {
  from: string;
  to: string;
  revenue: string;
  expenses: string;
  profit: string;
};

export type AccountsReceivableBucket = {
  bucket: 'current' | '1_30' | '31_60' | '60_plus';
  amount: string;
  invoiceCount: number;
};

export type AccountsReceivableAgingReport = {
  generatedAt: string;
  buckets: AccountsReceivableBucket[];
};

export type MonthlySummaryReport = {
  year: number;
  month: number;
  revenue: string;
  expenses: string;
  profit: string;
  topClient: string | null;
  topExpenseCategory: string | null;
};
