// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";

test("no errors occur during page load", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
});

test("can edit text", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const before = await page.getByText("Hello, World!");
    expect(before).toHaveCount(0);
    const text = await page.getByText("CSS Zen Garden", {
        exact: true,
    });
    await text.click();
    await text.fill("Hello, World!");
    const after = await page.getByText("Hello, World!");
    expect(after).toHaveCount(1);
});
