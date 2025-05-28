// @ts-check
// This test builds the bookmarklet version of the script and executes it in the demo page to confirm it works.
import { test, expect } from "@playwright/test";
import { rollup } from "rollup";
import rollupConfig from "../../rollup.config.mjs";

const LOCAL_BOOKMARKLET = `(function(){const script=document.createElement("script");script.src="/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({hide:true});remarklet.activate()};})();`;

const inputOptions = {
    input: rollupConfig.input,
    plugins: rollupConfig.plugins,
};

const outputOptionsList = [
    {
        ...rollupConfig.output[0],
        file: "demo/public/remarklet.min.js",
    },
];

test("bookmarklet loads and enables drag", async ({ page }) => {
    await build();
    await page.goto("/");
    await page.addScriptTag({ content: LOCAL_BOOKMARKLET });
    await page.waitForFunction(
        () =>
            window.remarklet && typeof window.remarklet.activate === "function",
    );
    await page.evaluate(() => {
        window.remarklet.options({ hide: true });
        window.remarklet.activate();
    });
    const textString = "A demonstration of what can be accomplished";
    const text = await page.getByText(textString);
    expect(text).toHaveCount(1);
    await text.scrollIntoViewIfNeeded();
    const isVisible = await text.isVisible();
    expect(isVisible).toBeTruthy();
    const boundingBox = await text.boundingBox();
    if (!boundingBox) {
        throw new Error("Bounding box is null");
    }
    const start = {
        x: boundingBox.x + boundingBox.width / 2,
        y: boundingBox.y + boundingBox.height / 2,
    };
    const end = { ...start, x: start.x + 50 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 10 });
    const dragging = await text.getAttribute("data-remarklet-dragging");
    expect(dragging).toEqual("true");
    await page.mouse.up();
    const stillDragging = await text.getAttribute("data-remarklet-dragging");
    expect(stillDragging).toEqual(null);
    const newBoundingBox = await page.getByText(textString).boundingBox();
    if (!newBoundingBox) {
        throw new Error("New bounding box is null");
    }
    expect(newBoundingBox.x).toBeGreaterThan(boundingBox.x);
});

async function build() {
    let bundle;
    let buildFailed = false;
    try {
        bundle = await rollup(inputOptions);
        await generateOutputs(bundle);
    } catch (error) {
        buildFailed = true;
        console.error(error);
        if (bundle) {
            try {
                await bundle.close();
            } catch (error) {
                console.error("Error closing bundle:", error);
            }
        }
        process.exit(1);
    }
    if (bundle) {
        await bundle.close();
    }
}

async function generateOutputs(bundle) {
    for (const outputOptions of outputOptionsList) {
        await bundle.write(outputOptions);
    }
}
