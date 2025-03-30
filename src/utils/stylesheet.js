/**
 * Remarklet - Stylesheet Module.
 *
 * @package     ZachWatkins\Remarklet
 * @subpackage  Stylesheet
 * @description Module for creating and manipulating a stylesheet programmatically.
 * @author      Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
 * @copyright   Zachary Kendall Watkins Copyright (c) 2014-2025 All Rights Reserved.
 * @link        https://github.com/zachwatkins/remarklet
 * @license     https://spdx.org/licenses/MIT.html MIT License
 */
import LocalStorageItem from "./LocalStorageItem.js";

/**
 * Stylesheet Module
 * @constructor
 * @param {Object} options - Options for the stylesheet.
 * @param {object} options.persist - If present, will persist the stylesheet to localStorage and pass the given options to the LocalStorageItem constructor.
 * @param {boolean} options.persist.key - The key for localStorage.
 * @param {object} options.persist.extras - Additional properties to store in localStorage.
 */
export default function Stylesheet(options) {
    this.persist = typeof options.persist === "object";
    this.storage = {
        value: {
            ruleIndexes: {},
            rules: [],
        },
    };
    if (this.persist) {
        if (typeof options.persist.extras === "object") {
            this.storage = new LocalStorageItem({
                key: options.persist.key,
                type: "object",
                defaultValue: {
                    ...options.persist.extras,
                    ruleIndexes: {},
                    rules: [],
                },
            });
        } else {
            this.storage = new LocalStorageItem({
                key: options.persist.key,
                type: "object",
                defaultValue: {
                    ruleIndexes: {},
                    rules: [],
                },
            });
        }
    }
    this.element = document.createElement("style");
    document.head.appendChild(this.element);
    let selectors = Object.keys(this.storage.value.ruleIndexes);
    for (let i = 0; i < selectors.length; i++) {
        let selector = selectors[i];
        let index = this.storage.value.ruleIndexes[selector];
        let rule = this.storage.value.rules[index];
        this.element.sheet.insertRule(
            rule.selector + "{" + rule.rule + "}",
            index,
        );
    }
    if (this.persist.store) {
        this.storage.store();
    }

    /**
     * Set a CSS rule in the stylesheet.
     * @param {string} selector - The CSS selector to set the rule for.
     * @param {string} rule - The CSS rule to set.
     * @returns {void}
     */
    this.setRule = (selector, rule) => {
        var foundIndex =
            typeof this.storage.value.ruleIndexes[selector] === "number"
                ? this.storage.value.ruleIndexes[selector]
                : false;
        var ruletext = selector + "{" + rule + "}";
        if (foundIndex === false) {
            var newIndex = this.storage.value.rules.length;
            this.storage.value.ruleIndexes[selector] = newIndex;
            this.storage.value.rules.push({
                selector,
                rule,
            });
            this.element.sheet.insertRule(ruletext, newIndex);
        } else {
            this.element.sheet.deleteRule(foundIndex);
            this.element.sheet.insertRule(ruletext, foundIndex);
            this.storage.value.rules[foundIndex].rule = rule;
        }
        if (this.storage.store) {
            this.storage.store();
        }
    };
}
