import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.BASE_PATH || '';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: `http://127.0.0.1:4173${basePath}/`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }
  ],
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort',
    url: `http://127.0.0.1:4173${basePath}/`,
    reuseExistingServer: !process.env.CI
  }
});
