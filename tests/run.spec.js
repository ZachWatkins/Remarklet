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
    await page.mouse.move(boundingBox.x, boundingBox.y);
    await page.mouse.down();
    await page.mouse.move(boundingBox.x + 50, boundingBox.y, { steps: 10 });
    await page.mouse.up();
    await page.screenshot({ path: 'screenshot-after.png' });
    const newBoundingBox = await text.boundingBox();
    if (!newBoundingBox) {
        throw new Error('New bounding box is null');
    }
    expect(newBoundingBox.x).toEqual(boundingBox.x + 50);
    expect(newBoundingBox.y).toEqual(boundingBox.y);
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
});

test('can edit text', async ({ page }) => {
    page.on('pageerror', (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto('/');
    const textValue = 'Hello, World!';
    const text = await page.getByText(textValue);
    await text.click();
    for (let i = 0; i < textValue.length; i++) {
        await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('Goodbye, World!');
    const newText = await page.getByText('Goodbye, World!');
    expect(newText).toHaveCount(1);
    const originalText = await page.getByText('Hello, World!');
    expect(originalText).toHaveCount(0);
});
