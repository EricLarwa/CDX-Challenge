import { ButtonLink } from '../components/shared/ButtonLink';
import { PageHeader } from '../components/shared/PageHeader';

export function NotFoundPage() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        eyebrow="404"
        title="That page took an early lunch"
        description="The route is missing, but the rest of FinanceOS is still here and ready to help."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/">Back to dashboard</ButtonLink>
            <ButtonLink to="/reports" tone="secondary">
              Open reports
            </ButtonLink>
          </div>
        }
      />
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', color: '#475569' }}>
        Try heading back to invoices, expenses, or reports from the sidebar.
      </div>
    </div>
  );
}
