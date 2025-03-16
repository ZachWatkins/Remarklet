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
    const text = await page.getByText("CSS Zen Garden", {
        exact: true,
    });
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(boundingBox.x + 50, boundingBox.y, { steps: 10 });
    await page.mouse.up();
    const newBoundingBox = await text.boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    // Compare the width and height before and after, rounded to 2 decimal places.
    expect(Math.round(newBoundingBox.width * 100) / 100).toEqual(
        Math.round(boundingBox.width * 100) / 100,
    );
    expect(Math.round(newBoundingBox.height * 100) / 100).toEqual(
        Math.round(boundingBox.height * 100) / 100,
    );
    expect(newBoundingBox.y).toEqual(boundingBox.y);
    expect(newBoundingBox.x).toEqual(boundingBox.x + 50);
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
});

test("can edit text", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const textValue = "CSS Zen Garden";
    const text = await page.getByText(textValue, {
        exact: true,
    });
    await text.click();
    for (let i = 0; i < textValue.length; i++) {
        await page.keyboard.press("Backspace");
    }
    await page.keyboard.type("Hello, World!");
    const newText = await page.getByText("Hello, World!");
    expect(newText).toHaveCount(1);
    const originalText = await page.getByText("CSS Zen Garden", {
        exact: true,
    });
    expect(originalText).toHaveCount(0);
});

test("can resize text", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto("/");
    const text = await page.getByText("CSS Zen Garden", {
        exact: true,
    });
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    await page.mouse.move(boundingBox.x, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(boundingBox.x + 50, boundingBox.y + boundingBox.height / 2, {
        steps: 10,
    });
    await page.mouse.up();
    const newBoundingBox = await text.boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.width).toEqual(boundingBox.width - 50);
});
