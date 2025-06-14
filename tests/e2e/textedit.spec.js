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

test("contenteditable attribute should remain when mouse cursor moves away from element during text editing", async ({
    page,
}) => {
    await page.goto("/example-app.html");

    // Find an element to edit (using the same button as the previous test)
    const text = "Button with event handler on click.";
    const button = await page.getByText(text);
    await button.scrollIntoViewIfNeeded();

    // Click on the text to start editing
    await button.click();

    // Verify the element is editable by checking contenteditable attribute
    const isContentEditableAfterClick = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterClick).toBe(true);

    // Verify element has focus and is ready for editing
    const isFocusedAfterClick = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterClick).toBe(true);

    // Get the bounding box to calculate coordinates outside the element
    const boundingBox = await button.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }

    // Move mouse cursor outside the element (to the right and below)
    const outsideX = boundingBox.x + boundingBox.width + 50;
    const outsideY = boundingBox.y + boundingBox.height + 50;
    await page.mouse.move(outsideX, outsideY);

    // Wait a moment to allow any mouse events to process
    await page.waitForTimeout(100);

    // Verify the element still has contenteditable attribute
    const isContentEditableAfterMouseMove = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterMouseMove).toBe(true);

    // Verify element still has focus
    const isFocusedAfterMouseMove = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterMouseMove).toBe(true);

    // Test that typing still works after moving mouse away
    await page.keyboard.press("End");
    await page.keyboard.type(" - edited after mouse move");

    // Verify the text was successfully added
    await page.waitForTimeout(100);
    const updatedText = await page.getByText("- edited after mouse move");
    expect(updatedText).toBeTruthy();

    // Test that pressing Escape removes contenteditable and focus
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    const isContentEditableAfterEscape = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterEscape).toBe(false);

    const isFocusedAfterEscape = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterEscape).toBe(true);

    // Move the mouse cursor back to the middle of the button.
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2,
    );

    // Verify the contenteditable attribute is present again.
    const isContentEditableAfterMouseReturn = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterMouseReturn).toBe(true);

    // Click the button again to ensure it can be edited again.
    await button.click();
    const isContentEditableAfterSecondClick = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterSecondClick).toBe(true);
    const isFocusedAfterSecondClick = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterSecondClick).toBe(true);

    // Press Escape again to remove contenteditable and focus.
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    const isContentEditableAfterSecondEscape = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterSecondEscape).toBe(false);
    const isFocusedAfterSecondEscape = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterSecondEscape).toBe(true);

    // Click the button again to ensure it can be edited again without moving the mouse away and back to the element.
    await button.click();
    const isContentEditableAfterThirdClick = await button.evaluate(
        (el) => el.getAttribute("contenteditable") === "true",
    );
    expect(isContentEditableAfterThirdClick).toBe(true);
    const isFocusedAfterThirdClick = await button.evaluate(
        (el) => document.activeElement === el,
    );
    expect(isFocusedAfterThirdClick).toBe(true);
});
