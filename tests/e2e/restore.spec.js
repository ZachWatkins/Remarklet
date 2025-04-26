// @ts-check
// This file tests whether changes can be restored from localStorage using the persist option and remarklet.restore().
import { test, expect } from "@playwright/test";

const mockData = {
    "#zen-summary > p:nth-child(1)": {
        selector: "#zen-summary > p:nth-child(1)",
        initialStyle: "",
        restored: false,
        dragged: true,
        resized: false,
        edited: false,
        content: null,
        width: 414,
        height: 78,
        marginBottom: 0,
        marginRight: 0,
        display: "none",
        matrix3d: false,
        transform: [1, 0, 0, 1, -16.6666259765625, -111.33334350585938],
        lastTransform: [1, 0, 0, 1, 6.66668701171875, -22.666656494140625],
    },
};

test("can restore changes using remarklet.restore", async ({ page }) => {
    // Set local storage state before navigating.
    await page.addInitScript((mockData) => {
        window.localStorage.setItem(
            "remarklet-changemap",
            JSON.stringify(mockData),
        );
    }, mockData);

    await page.goto("?restore=true");
    const textString = "A demonstration of what can be accomplished";
    const hiddenText = await page.getByText(textString);
    expect(hiddenText).toHaveCount(1);
    expect(hiddenText).not.toBeVisible();
});
