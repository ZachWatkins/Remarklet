import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
    test("accessibility test for home page", async ({ page }) => {
        // Navigate to the page
        await page.goto("/");

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
});
