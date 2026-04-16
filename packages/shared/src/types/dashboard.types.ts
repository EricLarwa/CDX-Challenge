export type HealthScore = {
  score: number;
  label: 'Strong' | 'Stable' | 'At Risk';
  drivers: string[];
};

export type KpiSummary = {
  revenueMTD: string;
  expensesMTD: string;
  outstanding: string;
  overdue: string;
};

export type CashFlowPoint = {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
};

export type DashboardAlert = {
  id: string;
  type: 'overdue_invoice' | 'upcoming_bill' | 'anomaly' | 'info';
  title: string;
  description: string;
  actionLabel?: string;
};

export type DashboardPayload = {
  healthScore: HealthScore;
  summary: KpiSummary;
  cashFlow: CashFlowPoint[];
  alerts: DashboardAlert[];
};
