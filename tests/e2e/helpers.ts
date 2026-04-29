import type { Page } from '@playwright/test';

export async function registerAndEnterApp(page: Page) {
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

  await page.goto('/register');
  await page.getByTestId('register-business-name').fill('FinanceOS Test Studio');
  await page.getByTestId('register-email').fill(`judge+${uniqueSuffix}@financeos.test`);
  await page.getByTestId('register-password').fill('judgepass123');
  await page.getByTestId('register-submit').click();
  await page.waitForURL('**/dashboard');
}
