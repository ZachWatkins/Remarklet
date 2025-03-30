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
import LocalStorageItem from "./localStorageItem.js";

/**
 * Stylesheet Module
 * @constructor
 */
export default function Stylesheet() {
    this.storage = new LocalStorageItem({
        key: "remarklet-stylesheet",
        type: "object",
        defaultValue: {
            ruleIndexes: {},
            rules: [],
        },
    });
    this.element = document.createElement("style");
    document.head.appendChild(this.element);
    for (let i = 0; i < this.storage.value.rules.length; i++) {
        let rule = this.storage.value.rules[i];
        this.element.sheet.insertRule(
            rule.selector + "{" + rule.value + "}",
            i,
        );
        this.storage.value.ruleIndexes[rule.selector] = i;
    }
    this.storage.store();

    /**
     * Set a CSS rule in the stylesheet.
     * @param {string} selector - The CSS selector to set the rule for.
     * @param {string} rule - The CSS rule to set.
     * @returns {void}
     */
    this.setRule = (selector, rule) => {
        var foundIndex = this.storage.value.ruleIndexes[selector] || false;
        var ruletext = selector + "{" + rule + "}";
        if (foundIndex !== false) {
            this.element.sheet.insertRule(ruletext, foundIndex);
            this.storage.value.rules[foundIndex].value = rule;
        } else {
            var newIndex = this.storage.value.rules.length;
            this.storage.value.ruleIndexes[selector] = newIndex;
            this.storage.value.rules.push({
                selector: selector,
                value: rule,
            });
            this.element.sheet.insertRule(ruletext, newIndex);
        }
        this.storage.store();
    };
}
