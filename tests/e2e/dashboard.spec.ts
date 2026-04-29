import { expect, test } from '@playwright/test';

import { registerAndEnterApp } from './helpers';

test('dashboard KPIs are visible after sign in', async ({ page }) => {
  await registerAndEnterApp(page);

  await expect(page.getByTestId('dashboard-revenue')).toBeVisible();
  await expect(page.getByTestId('dashboard-expenses')).toBeVisible();
  await expect(page.getByTestId('dashboard-outstanding')).toBeVisible();
  await expect(page.getByTestId('dashboard-health')).toBeVisible();
});
