import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("accessibility test for home page", async ({ page }) => {
    await page.goto("/docs/install");
    await page.waitForLoadState("networkidle");
    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
    if (accessibilityScanResults.violations.length > 0) {
        const testDetails = {
            page: path,
            date: new Date().toISOString(),
            violations: accessibilityScanResults.violations,
        };
        test.info({ testDetails });
    }
    expect(accessibilityScanResults.violations).toEqual([]);
});
