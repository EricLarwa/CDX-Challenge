import { expect, test } from '@playwright/test';

import { loginAsDemo } from './helpers';

test('dashboard KPIs are visible after sign in', async ({ page }) => {
  await loginAsDemo(page);

  await expect(page.getByTestId('dashboard-revenue')).toBeVisible();
  await expect(page.getByTestId('dashboard-expenses')).toBeVisible();
  await expect(page.getByTestId('dashboard-outstanding')).toBeVisible();
  await expect(page.getByTestId('dashboard-health')).toBeVisible();
});
