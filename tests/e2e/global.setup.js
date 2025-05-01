/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// @ts-check
import { test as setup } from "@playwright/test";

setup("detect page errors", async ({ page }) => {
    page.on("pageerror", (error) => {
        console.error(error);
        setup.fail();
    });
});
