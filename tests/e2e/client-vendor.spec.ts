import { expect, test } from '@playwright/test';

import { registerAndEnterApp } from './helpers';

test('user can create a client and start a prefilled invoice from the client profile', async ({ page }) => {
  await registerAndEnterApp(page);

  await page.goto('/clients/new');
  await page.getByTestId('client-name').fill('Northwind Studio');
  await page.getByTestId('client-email').fill('ap@northwind.test');
  await page.getByTestId('client-payment-terms').fill('21');
  await page.getByTestId('client-submit').click();

  await expect(page.getByText('Client created successfully.')).toBeVisible();
  await expect(page.getByText('Northwind Studio')).toBeVisible();

  await page.getByRole('link', { name: 'Create invoice' }).first().click();
  await expect(page).toHaveURL(/\/invoices\/new\?clientId=/);
  await expect(page.getByTestId('invoice-client')).not.toHaveValue('');
});

test('user can create a vendor and launch a prefilled expense flow', async ({ page }) => {
  await registerAndEnterApp(page);

  await page.goto('/vendors/new');
  await page.getByTestId('vendor-name').fill('Blue River Hosting');
  await page.getByTestId('vendor-category').fill('Software');
  await page.getByTestId('vendor-email').fill('billing@blueriver.test');
  await page.getByTestId('vendor-submit').click();

  await expect(page.getByText('Vendor created successfully.')).toBeVisible();
  await expect(page.getByText('Blue River Hosting')).toBeVisible();

  await page.getByRole('link', { name: 'Log expense for this vendor' }).first().click();
  await expect(page).toHaveURL(/\/expenses\/new\?vendorId=/);
  await expect(page.locator('select[name="vendorId"]')).not.toHaveValue('');
});
