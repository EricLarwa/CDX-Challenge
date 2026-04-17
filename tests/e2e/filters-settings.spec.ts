import { expect, test } from '@playwright/test';

import { loginAsDemo } from './helpers';

test('user can reset invoice and expense filters after narrowing a view', async ({ page }) => {
  await loginAsDemo(page);

  await page.goto('/invoices');
  await page.getByLabel('Status').selectOption('PAID');
  await page.getByTestId('invoice-clear-filters').click();
  await expect(page.getByTestId('invoice-clear-filters')).toHaveCount(0);

  await page.goto('/expenses');
  await page.getByLabel('Category').selectOption('SOFTWARE');
  await page.getByTestId('expense-clear-filters').click();
  await expect(page.getByTestId('expense-clear-filters')).toHaveCount(0);
});

test('user can save settings and reset report filters', async ({ page }) => {
  await loginAsDemo(page);

  await page.goto('/settings');
  await page.getByTestId('settings-business-name').fill('FinanceOS Labs');
  await page.getByTestId('settings-currency').selectOption('CAD');
  await page.getByTestId('settings-tax-rate').fill('8.5');
  await page.getByTestId('settings-payment-terms').fill('30');
  await page.getByTestId('settings-save').click();
  await expect(page.getByText('Saved locally for this workspace.')).toBeVisible();

  await page.goto('/reports?from=2026-03-01&to=2026-03-31&month=2026-03');
  await page.getByTestId('reports-reset-filters').click();
  await expect(page).toHaveURL(/from=2026-01-01/);
});
