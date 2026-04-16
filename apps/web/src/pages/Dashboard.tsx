import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/dashboard/StatCard';

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Financial health at a glance"
        description="The dashboard is positioned for Health Score, KPIs, cash flow, alerts, and quick actions from the spec."
      />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <StatCard label="Revenue MTD" value="$3,247.50" tone="success" />
        <StatCard label="Expenses MTD" value="$128.00" />
        <StatCard label="Outstanding" value="$1,800.00" tone="warning" />
        <StatCard label="Health Score" value="82 / 100" tone="success" />
      </section>
    </div>
  );
}
