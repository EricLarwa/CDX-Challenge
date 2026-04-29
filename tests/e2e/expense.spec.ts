import { expect, test } from '@playwright/test';

import { registerAndEnterApp } from './helpers';

test('user can log an expense and return to the expense list', async ({ page }) => {
  await registerAndEnterApp(page);

  await page.goto('/expenses/new');
  await page.getByTestId('expense-description').fill('Linear annual subscription');
  await page.getByRole('button', { name: 'Suggest' }).click();
  await expect(page.getByText(/Suggested by/)).toBeVisible();

  await page.getByTestId('expense-amount').fill('120.00');
  await page.getByTestId('expense-submit').click();

  await expect(page).toHaveURL(/\/expenses$/);
  await expect(page.getByText('Expense logged successfully.')).toBeVisible();
  await expect(page.getByText('Linear annual subscription')).toBeVisible();
});
