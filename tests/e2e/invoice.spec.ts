import { expect, test } from '@playwright/test';

import { registerAndEnterApp } from './helpers';

test('user can create, send, and record payment for an invoice', async ({ page }) => {
  await registerAndEnterApp(page);

  await page.goto('/invoices/new');
  await page.getByTestId('invoice-client').selectOption({ index: 1 });
  await page.getByTestId('invoice-line-description-0').fill('Strategy workshop');
  await page.getByTestId('invoice-line-quantity-0').fill('2');
  await page.getByTestId('invoice-line-unit-price-0').fill('150');
  await page.getByTestId('invoice-submit').click();

  await expect(page.getByText('Invoice created. Review it, then send it when you are ready.')).toBeVisible();
  await page.getByTestId('send-invoice').click();
  await expect(page.getByText('Invoice marked as sent.')).toBeVisible();

  await page.getByLabel('Amount').fill('300.00');
  await page.getByTestId('record-payment-submit').click();
  await expect(page.getByText('Payment recorded successfully.')).toBeVisible();
});
