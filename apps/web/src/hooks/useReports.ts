import { useQuery } from '@tanstack/react-query';

import { api } from '../lib/api';
import { getMonthParts, toDateRangeParams } from '../lib/report-filters';
import { useAuthStore } from '../stores/auth.store';

type ProfitAndLossReport = {
  from: string;
  to: string;
  revenue: string;
  expenses: string;
  profit: string;
};

type CashFlowPoint = {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
};

type AgingBucket = {
  bucket: string;
  amount: string;
  invoiceCount: number;
};

type MonthlySummary = {
  year: number;
  month: number;
  revenue: string;
  expenses: string;
  profit: string;
  topClient: string | null;
  topExpenseCategory: string | null;
};

export function useProfitAndLoss(range: { from: string; to: string }) {
  const token = useAuthStore((state) => state.token);
  const params = toDateRangeParams(range);

  return useQuery({
    queryKey: ['reports', 'pnl', range.from, range.to],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: ProfitAndLossReport }>('/reports/pnl', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data.data;
    },
  });
}

export function useCashFlowReport(range: { from: string; to: string }) {
  const token = useAuthStore((state) => state.token);
  const params = toDateRangeParams(range);

  return useQuery({
    queryKey: ['reports', 'cashflow', range.from, range.to],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: CashFlowPoint[] }>('/reports/cashflow', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data.data;
    },
  });
}

export function useArAgingReport() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['reports', 'ar-aging'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: { buckets: AgingBucket[] } }>('/reports/ar-aging', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.buckets;
    },
  });
}

export function useMonthlySummary(monthValue: string) {
  const token = useAuthStore((state) => state.token);
  const { year, month } = getMonthParts(monthValue);

  return useQuery({
    queryKey: ['reports', 'monthly-summary', year, month],
    enabled: Boolean(token && year && month),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: MonthlySummary }>(`/reports/monthly/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
}
