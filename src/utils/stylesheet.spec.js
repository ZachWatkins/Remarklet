import Stylesheet from "./stylesheet.js";
import assert from "node:assert";
import test from "node:test";
import {
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId,
    // Tip: all queries are also exposed on an object
    // called "queries" which you could import here as well
    waitFor,
} from "@testing-library/dom";
import "global-jsdom/register";

test("stylesheet can be managed programmatically", async () => {
    const stylesheet = new Stylesheet();
    const style = stylesheet.element;
    const rule = "color: red; background: blue;";
    const selector = ".test";
    stylesheet.setRule(selector, rule);
    assert.equal(style.sheet.cssRules[0].selectorText, selector);
    assert.equal(style.sheet.cssRules[0].style.cssText, rule);
});
