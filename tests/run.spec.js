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
    await page.getByText('Deactivate').click();
    await page.waitForTimeout(1000);
    await page.getByText('Activate', { exact: true }).click();
    await page.waitForTimeout(1000);
});
