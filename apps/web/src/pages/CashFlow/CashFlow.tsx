import { PageHeader } from '../../components/shared/PageHeader';
import { useCashFlowReport } from '../../hooks/useReports';

export function CashFlowPage() {
  const cashFlowQuery = useCashFlowReport();
  const points = cashFlowQuery.data ?? [];

  return (
    <div>
      <PageHeader title="Cash flow timeline" description="Projected inflows and outflows are now populated from the reports API." />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {points.map((point) => (
          <div key={point.period} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
            <strong>{point.period}</strong>
            <div style={{ marginTop: '0.4rem', color: '#64748b' }}>
              Inflow ${point.inflow.toFixed(2)} · Outflow ${point.outflow.toFixed(2)} · Net ${point.net.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
