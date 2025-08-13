import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    viewport: { width: 1280, height: 720 },
    colorScheme: "light",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_DEV_COMMAND || "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_DRONEREGION_URL: process.env.NEXT_PUBLIC_DRONEREGION_URL },
  },
});
