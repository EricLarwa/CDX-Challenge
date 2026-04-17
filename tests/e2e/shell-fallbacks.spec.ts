import { expect, test } from '@playwright/test';

import { loginAsDemo } from './helpers';

test('user can recover from an unknown route via the 404 screen', async ({ page }) => {
  await loginAsDemo(page);

  await page.goto('/definitely-not-a-real-route');
  await expect(page.getByText('That page took an early lunch')).toBeVisible();
  await page.getByRole('link', { name: 'Back to dashboard' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('sidebar navigation keeps the main product routes reachable', async ({ page }) => {
  await loginAsDemo(page);

  await page.getByRole('link', { name: 'Invoices' }).click();
  await expect(page).toHaveURL(/\/invoices$/);

  await page.getByRole('link', { name: 'Expenses' }).click();
  await expect(page).toHaveURL(/\/expenses$/);

  await page.getByRole('link', { name: 'Reports' }).click();
  await expect(page).toHaveURL(/\/reports$/);
});
