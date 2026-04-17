import type { Page } from '@playwright/test';

export async function loginAsDemo(page: Page) {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('demo@financeos.app');
  await page.getByTestId('login-password').fill('demo12345');
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/');
}
