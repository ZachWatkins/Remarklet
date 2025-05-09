// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: "./tests/e2e",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Each test is given 30 seconds. */
    timeout: 30000,
    /* Configuration for the expect assertion library. */
    expect: {
        /* Maximum time expect() should wait for the condition to be met. */
        timeout: 6000,
    },
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:3000",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",

        /* Attach screenshots to the HTML report on failure */
        screenshot: "only-on-failure",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "setup",
            testMatch: /global\.setup\.js/,
        },
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
            dependencies: ["setup"],
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            dependencies: ["setup"],
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
            dependencies: ["setup"],
        },
        {
            name: "Microsoft Edge",
            use: { ...devices["Desktop Edge"] },
            dependencies: ["setup"],
        },
        {
            name: "Google Chrome",
            use: { ...devices["Desktop Chrome"] },
            dependencies: ["setup"],
        },
        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        cwd: "demo",
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
    },
});
