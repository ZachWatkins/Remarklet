// playwright-screenshot.spec.js
// This script captures screenshots of documentation pages using Playwright.
// Run with: npx playwright test tests/screenshot/playwright-screenshot.spec.js

import { test, expect } from "@playwright/test";
import fs from "fs";

test("screenshots for documentation pages", async ({ page }) => {
    // Change the port if your Docusaurus site runs on a different port
    await page.goto("/");
    // Ensure the screenshots directory exists
    if (!fs.existsSync("static/img")) {
        fs.mkdirSync("static/img", { recursive: true });
    }
    await page.waitForSelector("main");
    const title = await page.getByRole("heading", { name: "Remarklet" });
    // Activate the library.
    const button = await page.getByText("Activate", { exact: true });
    await expect(title).toBeVisible();
    await expect(button).toBeVisible();
    await button.click();
    // Drag the "Remarklet" text by 50px to the top and right, then take a screenshot.
    let screenshotPath = "static/img/example-drag.png";
    const titleBox = await title.boundingBox();
    if (!titleBox) {
        throw new Error("Title bounding box not found");
    }
    await page.mouse.move(
        titleBox.x + titleBox.width / 2,
        titleBox.y + titleBox.height / 2,
        {
            steps: 10,
        },
    );
    await page.mouse.down();
    await page.mouse.move(
        titleBox.x + titleBox.width / 2 + 100,
        titleBox.y + titleBox.height / 2 - 50,
        {
            steps: 10,
        },
    );
    await page.screenshot({
        path: screenshotPath,
        fullPage: true,
    });
    expect(screenshotPath).toBeDefined();
});
