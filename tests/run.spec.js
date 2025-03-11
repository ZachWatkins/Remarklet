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
    await page.getByText('Activate', { exact: true }).click();
    await page.waitForTimeout(1000);

    // Take a screenshot.
    // await page.screenshot({ path: 'screenshot-before.png' });

    // Drag the Hello World text to the top right corner.
    const helloworld = page.getByText('Hello, World!');
    const boundingBox = await helloworld.boundingBox();
    if (!boundingBox) {
        throw new Error('Bounding box not found');
    }
    const x = boundingBox.x + boundingBox.width;
    const y = boundingBox.y + boundingBox.height;
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(x, y);
    await page.mouse.up();

    // Take a screenshot after dragging.
    // await page.screenshot({ path: 'screenshot-after.png' });

    // Assert the position of the Hello World text after dragging.
    const newBoundingBox = await helloworld.boundingBox();
    if (!newBoundingBox) {
        throw new Error('Bounding box not found');
    }
    expect(newBoundingBox.x).toBeLessThan(x);
    expect(newBoundingBox.y).toBeLessThan(y);

    // Assert the feature can be deactivated and reactivated without error.
    await page.getByText('Deactivate').click();
    await page.waitForTimeout(1000);
    await page.getByText('Activate', { exact: true }).click();
    await page.waitForTimeout(1000);
});
