// @ts-check
import { test as setup } from "@playwright/test";

setup("detect page errors", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        setup.fail();
    });
    await page.goto("/");
});
