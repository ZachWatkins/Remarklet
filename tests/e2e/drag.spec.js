/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";

test("can drag elements", async ({ page }) => {
    await page.goto("/");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    await text.scrollIntoViewIfNeeded();
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    const start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height / 2,
    };
    const end = { ...start, x: start.x + 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    const cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("move");
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    const dragging = await text.getAttribute("data-remarklet-dragging");
    expect(dragging).toEqual("true");
    await page.mouse.up();
    const stillDragging = await text.getAttribute("data-remarklet-dragging");
    expect(stillDragging).toEqual(null);
    const newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(Math.round(newBoundingBox.x * 100) / 100).toEqual(
        Math.round(boundingBox.x * 100) / 100 + 50,
    );
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round(boundingBox.y * 100) / 100,
    );
    expect(Math.round(newBoundingBox.width * 100) / 100).toBeCloseTo(
        Math.round(boundingBox.width * 100) / 100,
        1,
    );
    expect(Math.round(newBoundingBox.height * 100) / 100).toEqual(
        Math.round(boundingBox.height * 100) / 100,
    );
});

test("can drag element more than once", async ({ page }) => {
    await page.goto("/");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    const start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height / 2,
    };
    const end = { ...start, y: start.y - 50 };
    const end2 = { ...end, y: end.y - 50 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    await page.mouse.up();
    const newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 50) * 100) / 100,
    );
    await page.mouse.down();
    await page.mouse.move(end2.x, end2.y, {
        steps: 10,
    });
    await page.mouse.up();
    const new2BoundingBox = await page.getByText(textString).boundingBox();
    if (!new2BoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(Math.round(new2BoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 100) * 100) / 100,
    );
});

test("can drag element that has a mouse event without triggering that event", async ({
    page,
}) => {
    await page.goto("/example-app.html");
    const text = "Button with event handler on click.";
    const button = await page.getByText(text);
    await button.scrollIntoViewIfNeeded();
    const boundingBox = await button.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    const start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height / 2,
    };
    const end = { ...start, x: start.x + 50 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    page.on("dialog", async (dialog) => {
        test.fail(
            true,
            "The dialog should not be triggered if the button click event is being suppressed as expected.",
        );
        dialog.accept();
    });
    await page.mouse.up();
    const newBoundingBox = await button.boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(Math.round(newBoundingBox.x * 100) / 100).toEqual(
        Math.round(boundingBox.x * 100) / 100 + 50,
    );
});
