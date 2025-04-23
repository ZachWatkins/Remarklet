// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";

test("can resize elements smaller from the bottom edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height - 5,
    };
    let end = { ...start, y: start.y - 50 };
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.y).toBe(boundingBox.y);
    expect(newBoundingBox.height).toEqual(boundingBox.height - 50);
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height) - 50,
    );
});

test("can resize elements larger from the bottom edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height - 8,
    };
    let end = { ...start, y: start.y + 50 };
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.y).toBe(boundingBox.y);
    expect(newBoundingBox.height).toEqual(boundingBox.height + 50);
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height) + 50,
    );
});

test("can resize elements smaller from the right edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    await text.scrollIntoViewIfNeeded();
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x + boundingBox.width - 5,
        y: boundingBox.y + boundingBox.height / 2,
    };
    let end = { ...start, x: start.x - 50 };
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
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.x).toEqual(boundingBox.x);
    expect(Math.round(newBoundingBox.x + newBoundingBox.width)).toEqual(
        Math.round(boundingBox.x + boundingBox.width) - 50,
    );
});

test("can resize elements larger from the right edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    await text.scrollIntoViewIfNeeded();
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x + boundingBox.width - 6,
        y: boundingBox.y + boundingBox.height / 2,
    };
    let end = { ...start, x: start.x + 50 };
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
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.x).toEqual(boundingBox.x);
    expect(Math.round(newBoundingBox.x + newBoundingBox.width)).toEqual(
        Math.round(boundingBox.x + boundingBox.width) + 50,
    );
});

test("can resize elements smaller from the left edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    await text.scrollIntoViewIfNeeded();
    let boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    let start = {
        x: boundingBox.x,
        y: boundingBox.y + boundingBox.height / 2,
    };
    let end = { ...start, x: start.x + 50 };
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
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.width).toBeLessThan(boundingBox.width);
    expect(newBoundingBox.x).toBeGreaterThan(boundingBox.x);
    expect(newBoundingBox.x).toEqual(boundingBox.x + 50);
    expect(newBoundingBox.x).not.toEqual(boundingBox.x);
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.x + newBoundingBox.width)).toEqual(
        Math.round(boundingBox.x + boundingBox.width),
    );
});

test("can resize elements larger from the left edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
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

test("can resize elements smaller from the top edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
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
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + 1,
    };
    let end = { ...start, y: start.y + 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.height).toBeLessThan(boundingBox.height);
    expect(newBoundingBox.y).toBeGreaterThan(boundingBox.y);
    expect(newBoundingBox.y).toEqual(boundingBox.y + 50);
    expect(newBoundingBox.y).not.toEqual(boundingBox.y);
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height),
    );
});

test("can resize elements larger from the top edge", async ({ page }) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
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
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + 5,
    };
    let end = { ...start, y: start.y - 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    expect(cursor).toEqual("ns-resize");
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    expect(cursor).toEqual("ns-resize");
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.height).toBeGreaterThan(boundingBox.height);
    expect(newBoundingBox.y).toBeLessThan(boundingBox.y);
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 50) * 100) / 100,
    );
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height),
    );
});

test("can repeatedly resize elements larger from the top edge", async ({
    page,
}) => {
    const remarklet = await page.evaluateHandle("window.remarklet");
    await page.evaluate((remarklet) => remarklet.activate(), remarklet);
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
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + 5,
    };
    let end = { ...start, y: start.y - 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    let cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    expect(cursor).toEqual("ns-resize");
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    expect(cursor).toEqual("ns-resize");
    let resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    let stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    let newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.height).toBeGreaterThan(boundingBox.height);
    expect(newBoundingBox.y).toBeLessThan(boundingBox.y);
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 50) * 100) / 100,
    );
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height),
    );
    // Resize again
    boundingBox = newBoundingBox;
    start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + 5,
    };
    end = { ...start, y: start.y - 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    expect(cursor).toEqual("ns-resize");
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    expect(cursor).toEqual("ns-resize");
    resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.height).toBeGreaterThan(boundingBox.height);
    expect(newBoundingBox.y).toBeLessThan(boundingBox.y);
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 50) * 100) / 100,
    );
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height),
    );
    // Resize again
    boundingBox = newBoundingBox;
    start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + 5,
    };
    end = { ...start, y: start.y - 50 };
    // Hover over the element to show the drag cursor.
    await page.mouse.move(start.x, start.y);
    cursor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).cursor;
    });
    expect(cursor).toEqual("ns-resize");
    await page.mouse.down();
    expect(cursor).toEqual("ns-resize");
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    expect(cursor).toEqual("ns-resize");
    resizing = await text.getAttribute("data-remarklet-resizing");
    expect(resizing).toEqual("true");
    await page.mouse.up();
    stillResizing = await text.getAttribute("data-remarklet-resizing");
    expect(stillResizing).toEqual(null);
    newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.height).toBeGreaterThan(boundingBox.height);
    expect(newBoundingBox.y).toBeLessThan(boundingBox.y);
    expect(Math.round(newBoundingBox.y * 100) / 100).toEqual(
        Math.round((boundingBox.y - 50) * 100) / 100,
    );
    // Assert the right edge has not moved.
    expect(Math.round(newBoundingBox.y + newBoundingBox.height)).toEqual(
        Math.round(boundingBox.y + boundingBox.height),
    );
});
