import { useMemo, useState } from 'react';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAuthStore } from '../../stores/auth.store';

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD'] as const;

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const preferences = useAuthStore((state) => state.preferences);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updatePreferences = useAuthStore((state) => state.updatePreferences);
  const [businessName, setBusinessName] = useState(user?.businessName ?? '');
  const [currency, setCurrency] = useState(user?.currency ?? 'USD');
  const [defaultTaxRate, setDefaultTaxRate] = useState(preferences.defaultTaxRate);
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(String(preferences.defaultPaymentTerms));
  const [saved, setSaved] = useState(false);

  const summary = useMemo(
    () => ({
      businessName: businessName || 'Not set yet',
      currency,
      taxRate: `${defaultTaxRate || '0'}%`,
      paymentTerms: `${defaultPaymentTerms || '14'} days`,
    }),
    [businessName, currency, defaultTaxRate, defaultPaymentTerms],
  );

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title="Settings"
        description="Keep a few business defaults handy so invoicing starts closer to done."
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ButtonLink to="/reports" tone="secondary">
              View reports
            </ButtonLink>
            <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem' }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateUser({
              businessName: businessName.trim() || null,
              currency,
            });
            updatePreferences({
              defaultTaxRate: defaultTaxRate || '0',
              defaultPaymentTerms: Number(defaultPaymentTerms || '14'),
            });
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1800);
          }}
          style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '1rem' }}
        >
          <strong>Business defaults</strong>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span style={{ color: '#475569', fontSize: '0.9rem' }}>Business name</span>
            <input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Acme Studio LLC"
              style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>Currency</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>Default tax rate</span>
              <input
                value={defaultTaxRate}
                onChange={(event) => setDefaultTaxRate(event.target.value)}
                inputMode="decimal"
                style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>Payment terms</span>
              <input
                value={defaultPaymentTerms}
                onChange={(event) => setDefaultPaymentTerms(event.target.value)}
                inputMode="numeric"
                style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}
              />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="submit"
              style={{ padding: '0.9rem 1rem', borderRadius: '0.85rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}
            >
              Save defaults
            </button>
            {saved ? <span style={{ color: '#166534', fontWeight: 600 }}>Saved locally for this workspace.</span> : null}
          </div>
        </form>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '1rem' }}>
          <div>
            <strong>Current summary</strong>
            <div style={{ marginTop: '0.6rem', color: '#475569', display: 'grid', gap: '0.35rem' }}>
              <div>Name: {summary.businessName}</div>
              <div>Email: {user?.email ?? 'No signed-in user'}</div>
              <div>Currency: {summary.currency}</div>
              <div>Default tax: {summary.taxRate}</div>
              <div>Payment terms: {summary.paymentTerms}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <ButtonLink to="/invoices/new">Start a new invoice</ButtonLink>
            <ButtonLink to="/clients" tone="secondary">
              Review clients
            </ButtonLink>
            <ButtonLink to="/reports/monthly" tone="secondary">
              Open monthly summary
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
