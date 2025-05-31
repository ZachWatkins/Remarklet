import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

// Read the docs directory and generate the base pages list
const basePages = fs.readdirSync("docs").map((file) => {
    return `/docs/${file.replace(".md", "")}`;
});

test.describe("Accessibility Tests", () => {
    // Run accessibility tests on each page
    for (const path of basePages) {
        test(`accessibility test for ${path}`, async ({ page }) => {
            // Navigate to the page
            await page.goto(path);

            // Wait for page to be fully loaded
            await page.waitForLoadState("networkidle");

            // Run accessibility tests
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .analyze();

            // If there are violations, save details to a file
            if (accessibilityScanResults.violations.length > 0) {
                const testDetails = {
                    page: path,
                    date: new Date().toISOString(),
                    violations: accessibilityScanResults.violations,
                };
                test.info({ testDetails });
            }

            // Assert no violations
            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }
});
