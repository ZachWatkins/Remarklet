import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

// Define the base pages to test
const basePages = [
    "/", // Home page
    "/docs/intro", // Documentation intro
    "/docs/api", // API Reference
];

// Function to discover additional pages from sitemap
async function discoverPagesFromSitemap(page) {
    try {
        await page.goto("https://zacharywatkins.com/remarklet/sitemap.xml");
        const content = await page.content();
        const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];
        const urls = matches.map((match) => {
            const url = match.replace("<loc>", "").replace("</loc>", "");
            return new URL(url).pathname;
        });
        return [...new Set([...basePages, ...urls])]; // Deduplicate
    } catch (error) {
        console.log("Sitemap not found or error parsing it:", error);
        return basePages;
    }
}

test.describe("Accessibility Tests", () => {
    let pages = basePages;

    test.beforeAll(async ({ browser }) => {
        // Try to discover pages from sitemap
        const context = await browser.newContext();
        const page = await context.newPage();
        pages = await discoverPagesFromSitemap(page);
        await context.close();

        // Log discovered pages
        console.log(`Testing ${pages.length} pages for accessibility:`);
        pages.forEach((page) => console.log(` - ${page}`));

        // Create directory if it doesn't exist
        if (!fs.existsSync("test-results")) {
            fs.mkdirSync("test-results", { recursive: true });
        }

        // Write discovered pages to a file for reporting
        fs.writeFileSync(
            "test-results/discovered-pages.json",
            JSON.stringify(pages, null, 2),
        );
    });

    // Run accessibility tests on each page
    for (const path of basePages) {
        test(`accessibility test for ${path}`, async ({ page }) => {
            // Navigate to the page
            await page.goto(`https://zacharywatkins.com${path}`);

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

                // Create directory if it doesn't exist
                if (!fs.existsSync("test-results")) {
                    fs.mkdirSync("test-results", { recursive: true });
                }

                const sanitizedPath = path.replace(/[^a-zA-Z0-9]/g, "_");
                fs.writeFileSync(
                    `test-results/a11y-violations-${sanitizedPath}.json`,
                    JSON.stringify(testDetails, null, 2),
                );
            }

            // Assert no violations
            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }
});
