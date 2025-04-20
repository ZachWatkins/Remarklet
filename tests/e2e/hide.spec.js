// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";

test("can hide elements", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    expect(text).toBeVisible();
    await text.scrollIntoViewIfNeeded();
});
