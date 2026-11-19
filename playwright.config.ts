import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';
const port = new URL(baseURL).port;

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: process.env.CI ? [['github'], ['html']] : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    // Link prefetching is enabled only in production. Use the generated preview catalog.
    command: `pnpm build && pnpm start --hostname 127.0.0.1 --port ${port}`,
    env: { EXPOSE_TESTING_API: '1', POSTGRES_URL: '' },
    timeout: 120_000,
    reuseExistingServer: true,
    stdout: 'pipe',
    url: baseURL,
  },
  workers: 1,
});
