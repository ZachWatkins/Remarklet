// filepath: c:\Users\watki\repositories\remarklet\tests\cssSelector.spec.js
// @ts-check
import { test, expect } from "@playwright/test";
import { injectCssSelectorFunctions } from "./helpers/injectCssSelectorFunctions.js";

test.beforeEach(async ({ page }) => {
    // Inject the cssSelector functions into the browser context
    await injectCssSelectorFunctions(page);
});

test("getUniqueSelector returns id selector when element has id", async ({
    page,
}) => {
    await page.setContent(`
        <div id="test-element" class="test-class">Test Element</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.getElementById("test-element");
        return window.getUniqueSelector(element);
    });

    expect(result).toBe("#test-element");
});

test("getUniqueSelector can identify elements by class", async ({ page }) => {
    await page.setContent(`
        <div class="unique-class">Test Element</div>
        <div class="another-class">Another Element</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelector(".unique-class");
        return window.getUniqueSelector(element);
    });

    expect(result).toBe("div.unique-class");
});

test("getUniqueSelector can identify elements by attributes", async ({
    page,
}) => {
    await page.setContent(`
        <div data-test="unique-value">Test Element</div>
        <div data-test="another-value">Another Element</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelector('[data-test="unique-value"]');
        return window.getUniqueSelector(element);
    });

    expect(result).toBe('div[data-test="unique-value"]');
});

test("getUniqueSelector falls back to nth-child for similar elements", async ({
    page,
}) => {
    await page.setContent(`
        <div>
            <p>First paragraph</p>
            <p>Second paragraph</p>
            <p>Third paragraph</p>
        </div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelectorAll("p")[1];
        return window.getUniqueSelector(element);
    });

    // The result should include nth-child since there are multiple paragraphs
    expect(result).toBe(/p:nth-child\(2\)/);
});

test("getUniqueSelector creates a full path when optimized=false", async ({
    page,
}) => {
    await page.setContent(`
        <div class="container">
            <section class="section">
                <article class="article">
                    <p>Test paragraph</p>
                </article>
            </section>
        </div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelector("p");
        return window.getUniqueSelector(element, false);
    });

    // Should contain the full path
    expect(result).toMatch(
        /div\.container > section\.section > article\.article > p/,
    );
});

test("getUniqueSelector creates a full path when an element has both an id and class name and optimized=false", async ({
    page,
}) => {
    await page.setContent(`
        <div class="page-wrapper">
            <section class="intro" id="zen-intro">
                <div class="summary" id="zen-summary" role="article">
                    <p>
                        A demonstration of what can be accomplished through
                        <abbr title="Cascading Style Sheets">CSS</abbr>-based
                        design. Select any style sheet from the list to load it
                        into this page.
                    </p>
                    <p>
                        Download the example
                        <a href="/examples/index" title="This page's source HTML code, not to be modified.">html file</a>
                        and
                        <a href="/examples/style.css" title="This page's sample CSS, the file you may modify.">css file</a>
                    </p>
                </div>
            </section>
        </div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelector("p");
        return window.getUniqueSelector(element, false);
    });

    // Should contain the full path
    expect(result).toBe("#zen-summary > p:nth-child(1)");
});

test("isUniqueSelector correctly validates unique selectors", async ({
    page,
}) => {
    await page.setContent(`
        <div id="test-element">Test Element</div>
        <div class="another-element">Another Element</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.getElementById("test-element");
        return window.isUniqueSelector("#test-element", element);
    });

    expect(result).toBe(true);
});

test("isUniqueSelector returns false for non-unique selectors", async ({
    page,
}) => {
    await page.setContent(`
        <div class="same-class">First Element</div>
        <div class="same-class">Second Element</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.querySelector(".same-class");
        return window.isUniqueSelector(".same-class", element);
    });

    expect(result).toBe(false);
});

test("getUniqueSelector handles elements with special characters in IDs and classes", async ({
    page,
}) => {
    await page.setContent(`
        <div id="test.element" class="test:class">Test Element with special chars</div>
    `);

    const result = await page.evaluate(() => {
        const element = document.getElementById("test.element");
        return window.getUniqueSelector(element);
    });

    // CSS.escape should handle the dot in the ID
    expect(result).toBe("#test\\.element");
});

test("getUniqueSelector handles document.documentElement", async ({ page }) => {
    const result = await page.evaluate(() => {
        return window.getUniqueSelector(document.documentElement);
    });

    expect(result).toBe("html");
});

test("getUniqueSelector returns empty string for invalid inputs", async ({
    page,
}) => {
    const results = await page.evaluate(() => {
        return [
            window.getUniqueSelector(null),
            window.getUniqueSelector(undefined),
            window.getUniqueSelector(document.createTextNode("text node")),
        ];
    });

    expect(results[0]).toBe("");
    expect(results[1]).toBe("");
    expect(results[2]).toBe("");
});
