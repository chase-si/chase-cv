import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 4100);
const includeJourneys = process.env.PLAYWRIGHT_INCLUDE_JOURNEYS === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: includeJourneys ? undefined : ["**/journeys/**"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html"]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-headed",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        launchOptions: { slowMo: 250 },
      },
    },
  ],
});
