/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// @ts-check
// This file tests whether an element can be hidden by being dragged to the top right corner of the webpage and then released.
import { test, expect } from "@playwright/test";

test("can hide elements", async ({ page }) => {
    await page.goto("?hide=true");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    expect(text).toBeVisible();
    await text.scrollIntoViewIfNeeded();
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    const start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height / 2,
    };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 10, start.y - 10);
    const hideZone = await page.getByText("Hide");
    const hideZoneBox = await hideZone.boundingBox();
    if (!hideZoneBox) {
        throw new Error("Hide zone bounding box is null");
    }
    const end = {
        x: hideZoneBox.x + hideZoneBox.width / 2,
        y: hideZoneBox.y + hideZoneBox.height / 2,
    };
    await page.mouse.move(end.x, end.y);
    await page.mouse.up();
    await page.waitForTimeout(100);
    const hiddenText = await page.getByText(textString);
    expect(hiddenText).toHaveCount(1);
    expect(hiddenText).not.toBeVisible();
});
