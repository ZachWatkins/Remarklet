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

test("can drag elements", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
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
    const end = {
        x: boundingBox.x + boundingBox.width / 2 + 50,
        y: boundingBox.y + boundingBox.height / 2,
    };
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
    const transform = await text.evaluate((el) => {
        return el.style.transform;
    });
    expect(transform).toMatch("matrix(1, 0, 0, 1, 50, 0)");
    const newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(Math.round(newBoundingBox.x * 100) / 100).not.toEqual(
        Math.round(boundingBox.x * 100) / 100,
    );
    expect(Math.round(newBoundingBox.x * 100) / 100).toEqual(
        Math.round(boundingBox.x * 100) / 100 + 50,
    );
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round(boundingBox.y * 100) / 100,
    );
    expect(Math.round(newBoundingBox.width * 100) / 100).toEqual(
        Math.round(boundingBox.width * 100) / 100,
    );
    expect(Math.round(newBoundingBox.height * 100) / 100).toEqual(
        Math.round(boundingBox.height * 100) / 100,
    );
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

test("can resize elements from the right edge", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const text = await page.getByText("We must clear the mind of the past.");
    await text.scrollIntoViewIfNeeded();
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    await text.hover({
        position: {
            x: boundingBox.width - 1,
            y: boundingBox.height / 2,
        },
    });
    // Assert the mouse cursor is a resize cursor.
    const cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ew-resize");
    await page.mouse.down();
    await page.mouse.move(
        boundingBox.x + boundingBox.width - 1 - 50,
        boundingBox.y + boundingBox.height / 2,
        {
            steps: 10,
        },
    );
    expect(cursor).toEqual("ew-resize");
    await page.mouse.up();
    const newBoundingBox = await text.boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.width).toBeLessThan(boundingBox.width);
});

test("can resize elements smaller from the left edge", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    await text.scrollIntoViewIfNeeded();
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    // Test resize to reduce width.
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x,
        y: boundingBox.y + boundingBox.height / 2,
    };
    let end = {
        x: boundingBox.x + 50,
        y: boundingBox.y + boundingBox.height / 2,
    };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ew-resize");
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let transform = await text.evaluate((el) => {
        return el.style.transform;
    });
    expect(transform).toMatch("matrix(1, 0, 0, 1, 50, 0)");
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.width).toBeLessThan(boundingBox.width);
    expect(newBoundingBox.x).toBeGreaterThan(boundingBox.x);
    expect(newBoundingBox.x).toEqual(boundingBox.x + 50);
    expect(newBoundingBox.x).not.toEqual(boundingBox.x);
    // Assert the right edge has not moved.
    expect(
        Math.round(newBoundingBox.x + newBoundingBox.width),
    ).toEqual(Math.round(boundingBox.x + boundingBox.width));
});

test("can resize elements larger from the left edge", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    await text.scrollIntoViewIfNeeded();
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    // Test resize to reduce width.
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x + 10,
        y: boundingBox.y + boundingBox.height / 2,
    };
    let end = { ...start, x: start.x - 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ew-resize");
    await page.mouse.down();
    expect(cursor).toEqual("ew-resize");
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    expect(cursor).toEqual("ew-resize");
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let transform = await text.evaluate((el) => {
        return el.style.transform;
    });
    expect(transform).toMatch("matrix(1, 0, 0, 1, -50, 0)");
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.width).toBeGreaterThan(boundingBox.width);
    expect(newBoundingBox.x).toBeLessThan(boundingBox.x);
    expect(Math.round(newBoundingBox.x * 100) / 100).toEqual(
        Math.round((boundingBox.x - 50) * 100) / 100,
    );
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.x + newBoundingBox.width)).toEqual(
        Math.round(boundingBox.x + boundingBox.width),
    );
});
