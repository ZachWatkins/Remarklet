// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";
import { changeMapStorageKey } from "../../src/changeMap.js";

test("unstore works as expected", async ({ page }) => {
    await page.goto("?persist=true");
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
    const end = { ...start, x: start.x + 50 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, {
        steps: 10,
    });
    await page.mouse.up();
    const data = await page.evaluate(
        (changeMapStorageKey) => localStorage.getItem(changeMapStorageKey),
        changeMapStorageKey,
    );
    expect(data).not.toBe(null);
    const result = await page.evaluate(() => {
        try {
            // @ts-expect-error
            remarklet.unstore();
            return null;
        } catch (error) {
            return error;
        }
    });
    expect(result).toBe(null);
    const updatedData = await page.evaluate(
        (changeMapStorageKey) => localStorage.getItem(changeMapStorageKey),
        changeMapStorageKey,
    );
    expect(updatedData).toBe(null);
});
