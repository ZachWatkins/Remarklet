// @ts-check
// This file tests behaviors of CSS that Remarklet depends on.
import { test, expect } from "@playwright/test";

test("all 2D CSS transform rules evaluate as matrix transforms when using JS", async ({
    page,
}) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/css.html");
    const element = await page.$("#test-1 .target");
    if (!element) {
        throw new Error("Element not found");
    }
    expect(
        await element.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el);
            return computedStyle.transform;
        }),
    ).toBe("matrix(1, 0, 0, 1, 10, 10)");
});

test("all 3D CSS transform rules evaluate as matrix3d transforms when using JS", async ({
    page,
}) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/css.html");
    const element = await page.$("#test-2 .target");
    if (!element) {
        throw new Error("Element not found");
    }
    expect(
        await element.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el);
            return computedStyle.transform;
        }),
    ).toBe("matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 10, 10, 1)");
});
