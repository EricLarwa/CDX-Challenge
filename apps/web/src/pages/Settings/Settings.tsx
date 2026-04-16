import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAuthStore } from '../../stores/auth.store';

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Business defaults, currency, and invoice defaults will live here."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/reports" tone="secondary">
              View reports
            </ButtonLink>
            <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>Business profile</strong>
          <div style={{ marginTop: '0.6rem', color: '#475569' }}>
            <div>Name: {user?.businessName ?? 'Not set yet'}</div>
            <div>Email: {user?.email ?? 'No signed-in user'}</div>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
          <strong>Billing defaults</strong>
          <div style={{ marginTop: '0.6rem', color: '#475569' }}>
            <div>Currency: {user?.currency ?? 'USD'}</div>
            <div>Next pass: editable tax, payment terms, and invoice defaults.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
