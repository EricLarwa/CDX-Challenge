import { expect, test } from '@playwright/test';

test('demo user can sign in and reach dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('demo@financeos.app');
  await page.getByTestId('login-password').fill('demo12345');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Financial health at a glance')).toBeVisible();
  await expect(page.getByTestId('dashboard-health')).toBeVisible();
});
