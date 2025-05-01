/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// @ts-check
// This file tests behaviors of CSS that Remarklet depends on.
import { test, expect } from "@playwright/test";

test("all 2D CSS transform rules evaluate as matrix transforms when using JS", async ({
    page,
}) => {
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
