// @ts-check
// This file tests whether there are runtime errors simply from adding the script to the page.
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/tests/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('My Vite App');
});

test('no errors occur during page load', async ({ page }) => {
    page.on('pageerror', (error) => {
        console.error(error);
        test.fail();
    });
    await page.goto('/tests/');
});
