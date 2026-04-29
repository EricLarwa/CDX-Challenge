import { expect, test } from '@playwright/test';

test('user can register and reach dashboard', async ({ page }) => {
  const uniqueSuffix = Date.now();

  await page.goto('/register');
  await page.getByTestId('register-business-name').fill('FinanceOS Test Studio');
  await page.getByTestId('register-email').fill(`judge+${uniqueSuffix}@financeos.test`);
  await page.getByTestId('register-password').fill('judgepass123');
  await page.getByTestId('register-submit').click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Financial health at a glance')).toBeVisible();
  await expect(page.getByTestId('dashboard-health')).toBeVisible();
});
