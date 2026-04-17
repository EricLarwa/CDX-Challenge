import { useMemo } from 'react';

import { useAuthStore } from '../stores/auth.store';

export function useCurrencyFormatter() {
  const currency = useAuthStore((state) => state.user?.currency ?? 'USD');

  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      });
    } catch {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  }, [currency]);

  return {
    currency,
    formatCurrency(value: number | string) {
      return formatter.format(Number(value));
    },
  };
}
