import { useQuery } from '@tanstack/react-query';

import { api } from '../lib/api';
import { useAuthStore } from '../stores/auth.store';

const defaultRange = {
  from: '2026-04-01T00:00:00.000Z',
  to: '2026-04-30T23:59:59.000Z',
};

type ProfitAndLossReport = {
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

export function useProfitAndLoss() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['reports', 'pnl'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: ProfitAndLossReport }>('/reports/pnl', {
        headers: { Authorization: `Bearer ${token}` },
        params: defaultRange,
      });
      return response.data.data;
    },
  });
}

export function useCashFlowReport() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['reports', 'cashflow'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: CashFlowPoint[] }>('/reports/cashflow', {
        headers: { Authorization: `Bearer ${token}` },
        params: defaultRange,
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

export function useMonthlySummary() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['reports', 'monthly-summary'],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get<{ success: true; data: MonthlySummary }>('/reports/monthly/2026/4', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
}
