// playwright-screenshot.spec.js
// This script captures screenshots of documentation pages using Playwright.
// Run with: npx playwright test tests/screenshot/playwright-screenshot.spec.js

import { test, expect } from "@playwright/test";
import fs from "fs";

test("screenshot drag feature for documentation page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("main");
    let target = await page.getByText("Edit any web page.", {
        exact: true,
    });
    await expect(target).toBeVisible();
    // Activate the library.
    const button = await page.getByText("Activate Demo", { exact: true });
    await expect(button).toBeVisible();
    await button.click();
    // Drag the target to the top and right, then take a screenshot.
    let screenshotPath = "static/img/example-drag.png";
    let targetBox = await target.boundingBox();
    if (!targetBox) {
        throw new Error("target bounding box not found");
    }
    await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        {
            steps: 10,
        },
    );
    await page.mouse.down();
    await page.mouse.move(
        targetBox.x + targetBox.width / 2 + 500,
        targetBox.y + targetBox.height / 2 - 140,
        {
            steps: 10,
        },
    );
    await page.screenshot({
        path: screenshotPath,
        clip: {
            x: page.viewportSize().width - 280,
            y: 0,
            width: 280,
            height: 150,
        },
    });
    expect(fs.existsSync(screenshotPath)).toBe(true);
});

test("screenshot edit feature for documentation page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("main");
    let target = await page.getByText("Edit any web page.", {
        exact: true,
    });
    await expect(target).toBeVisible();
    // Activate the library.
    const button = await page.getByText("Activate Demo", { exact: true });
    await expect(button).toBeVisible();
    await button.click();
    let screenshotPath = "static/img/example-save.png";
    let targetBox = await target.boundingBox();
    if (!targetBox) {
        throw new Error("target bounding box not found");
    }
    await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        {
            steps: 10,
        },
    );
    await page.mouse.down();
    await page.waitForTimeout(200);
    await page.keyboard.press("End");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(", and save it.");
    let width = 350;
    let heightRatio = 150 / 280;
    await page.screenshot({
        path: screenshotPath,
        clip: {
            x: page.viewportSize().width / 2 - width / 2,
            y: 150,
            width: width,
            height: width * heightRatio,
        },
    });
    expect(fs.existsSync(screenshotPath)).toBe(true);
});
