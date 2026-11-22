import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    viewport: { width: 430, height: 932 },
  },
  projects: [
    {
      name: 'Mobile Chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 430, height: 932 } },
    },
  ],
  webServer: {
    command: 'node e2e/serve-dist.js',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
