import { defineConfig, devices } from "@playwright/test";
import path from "path";

const frontendDir = __dirname;
const backendDir = path.resolve(__dirname, "../backend");
const backendRunner = path.resolve(__dirname, "../backend/scripts/run_e2e_backend.py");

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3020",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      cwd: backendDir,
      command: `d:\\Splendid-Technology\\Velynxia\\.venv\\Scripts\\python.exe "${backendRunner}"`,
      url: "http://localhost:8011/api/v1/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      cwd: frontendDir,
      command: "npm run dev",
      url: "http://localhost:3020",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:8011/api/v1",
      },
    },
  ],
});
