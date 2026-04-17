import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node --import tsx apps/api/src/index.ts',
      url: 'http://127.0.0.1:3001/api/v1/health',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        PORT: '3001',
        FRONTEND_URL: 'http://127.0.0.1:5173',
      },
    },
    {
      command: 'bun run --filter @financeos/web dev -- --host 127.0.0.1 --port 5173',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_API_URL: 'http://127.0.0.1:3001/api/v1',
      },
    },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
