import { defineConfig, devices } from '@playwright/test';

const localProjects = process.env.PW_USE_SYSTEM_EDGE
  ? [{ name: 'edge', use: { channel: 'msedge' } }]
  : [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    ];

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: localProjects,
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start -p 3000' : 'npm run dev',
    port: 3000,
    timeout: 180000,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_DRONEREGION_URL: process.env.NEXT_PUBLIC_DRONEREGION_URL }
  },
});
