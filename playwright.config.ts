import { defineConfig, devices } from "@playwright/test";

const e2ePort = 43123;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",
  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: `http://127.0.0.1:${e2ePort}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 14"] },
    },
  ],

  webServer: {
    command: `npx next dev -p ${e2ePort} --hostname 127.0.0.1`,
    port: e2ePort,
    timeout: 120 * 1000,
    reuseExistingServer: false,
  },
});
