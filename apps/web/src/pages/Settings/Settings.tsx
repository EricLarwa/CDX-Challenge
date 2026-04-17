import { useMemo, useState } from 'react';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { downloadCsv } from '../../lib/export';
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
  const { formatCurrency } = useCurrencyFormatter();

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
    <div className="grid gap-4">
      <PageHeader
        title="Settings"
        description="Keep a few business defaults handy so invoicing starts closer to done."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadCsv('financeos-settings-summary.csv', ['Setting', 'Value'], [
                  ['Business name', businessName || 'Not set'],
                  ['Email', user?.email ?? 'No signed-in user'],
                  ['Currency', currency],
                  ['Default tax rate', `${defaultTaxRate || '0'}%`],
                  ['Default payment terms', `${defaultPaymentTerms || '14'} days`],
                ])
              }
            >
              Export summary
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <ButtonLink to="/reports" tone="secondary">
              View reports
            </ButtonLink>
            <ButtonLink to="/invoices/new">Create invoice</ButtonLink>
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5">
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
              className="grid gap-4"
            >
              <strong className="text-slate-950">Business defaults</strong>
              <div className="grid gap-2">
                <Label htmlFor="settings-business-name">Business name</Label>
                <Input
                  id="settings-business-name"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder="Acme Studio LLC"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="settings-currency">Currency</Label>
                  <Select id="settings-currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
                    {currencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="settings-tax-rate">Default tax rate</Label>
                  <Input
                    id="settings-tax-rate"
                    value={defaultTaxRate}
                    onChange={(event) => setDefaultTaxRate(event.target.value)}
                    inputMode="decimal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="settings-payment-terms">Payment terms</Label>
                  <Input
                    id="settings-payment-terms"
                    value={defaultPaymentTerms}
                    onChange={(event) => setDefaultPaymentTerms(event.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit">Save defaults</Button>
                {saved ? <FeedbackBanner tone="success" message="Saved locally for this workspace." /> : null}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-4 p-5">
            <div>
              <strong className="text-slate-950">Current summary</strong>
              <div className="mt-2 grid gap-1.5 text-sm text-slate-600">
                <div>Name: {summary.businessName}</div>
                <div>Email: {user?.email ?? 'No signed-in user'}</div>
                <div>Currency: {summary.currency}</div>
                <div>Default tax: {summary.taxRate}</div>
                <div>Payment terms: {summary.paymentTerms}</div>
                <div>Preview amount: {formatCurrency(1250)}</div>
              </div>
            </div>
            <div className="grid gap-3">
              <ButtonLink to="/invoices/new">Start a new invoice</ButtonLink>
              <ButtonLink to="/clients" tone="secondary">
                Review clients
              </ButtonLink>
              <ButtonLink to="/reports/monthly" tone="secondary">
                Open monthly summary
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
