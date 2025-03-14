// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Hello World');
});

test('no errors occur during page load', async ({ page }) => {
    page.on('pageerror', (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto('/');
});

test('can drag elements', async ({ page }) => {
    page.on('pageerror', (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto('/');
    const text = await page.getByText('Hello, World!');
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error('Bounding box is null');
    }
    // Take a screenshot and attach it to the report.
    await page.screenshot({ path: 'screenshot-before.png' });
    // Move the mouse to the text.
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    // Mouse down and drag the text.
    await page.mouse.down();
    await page.mouse.move(50, 50);
    await page.mouse.up();
    await page.screenshot({ path: 'screenshot-after.png' });
    // Check that the text has moved.
    const newBoundingBox = await text.boundingBox();
    if (!newBoundingBox) {
        throw new Error('New bounding box is null');
    }
    expect(newBoundingBox.x).toEqual(boundingBox.x + 50);
    expect(newBoundingBox.y).toEqual(boundingBox.y + 50);
    // Check that the text is still visible.
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    await page.screenshot({ path: 'screenshot-after.png' });
});

test('can edit text', async ({ page }) => {
    page.on('pageerror', (error) => {
        console.error(error);
        test.fail();
    });
    const text = await page.getByText('Hello, World!');
    await text.click();
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Goodbye, World!');
    const newText = await page.getByText('Goodbye, World!');
    expect(newText).toBeTruthy();
    const originalText = await page.getByText('Hello, World!');
    expect(originalText).toBeFalsy();
    await page.screenshot({ path: 'screenshot-edited.png' });
});
