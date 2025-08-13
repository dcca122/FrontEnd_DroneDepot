import { defineConfig, devices } from "@playwright/test";

const localProjects = process.env.PW_USE_SYSTEM_CHROME
  ? [{ name: "chrome", use: { channel: "chrome" } }]
  : [
      { name: "chromium", use: { ...devices["Desktop Chrome"] } },
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
      { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ];

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: localProjects,
  webServer: {
    command: process.env.PLAYWRIGHT_DEV_COMMAND || "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_DRONEREGION_URL: process.env.NEXT_PUBLIC_DRONEREGION_URL,
    },
  },
});
