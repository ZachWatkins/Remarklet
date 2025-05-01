/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from "@playwright/test";

test("can edit element text that has a mouse event without triggering that event", async ({
    page,
}) => {
    await page.goto("/example-app.html");
    page.on("dialog", (dialog) => {
        test.fail(
            true,
            "The dialog should not be triggered if the button click event is being suppressed as expected.",
        );
        dialog.accept();
    });
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
    await page.mouse.click(start.x, start.y);
    await page.keyboard.press("End");
    await page.keyboard.type("New text to be added");
    await page.waitForTimeout(100);
    const updatedText = await page.getByText("New text to be added");
    expect(updatedText).toBeTruthy();
});
