import { mockArAging, mockDashboard, mockMonthlySummary, mockPnl } from '../lib/mock-data';

export const getProfitAndLoss = async () => mockPnl;
export const getCashFlowReport = async () => mockDashboard.cashFlow;
export const getAccountsReceivableAging = async () => mockArAging;
export const getMonthlySummary = async (year: number, month: number) => ({
  ...mockMonthlySummary,
  year,
  month,
});
