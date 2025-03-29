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
        defaultValue: {},
    });
    this.ruleLength = 0;
    this.element = document.createElement("style");
    document.head.appendChild(this.element);
    var rules = this.storage.value;
    for (let selector in rules) {
        if (rules.hasOwnProperty(selector)) {
            this.element.sheet.insertRule(selector + rules[selector]);
        }
    }

    /**
     * Set a CSS rule in the stylesheet.
     * @param {string} selector - The CSS selector to set the rule for.
     * @param {string} rule - The CSS rule to set.
     * @returns {void}
     */
    this.setRule = (selector, rule) => {
        if (!rule) return;
        var found = this.storage.value[selector] || false;
        var ruletext = selector + '{' + rule + '}';
        if (found) {
            this.element.sheet.insertRule(ruletext, found.index);
            this.storage.value[selector].rule = ruletext;
        } else {
            this.element.sheet.insertRule(ruletext);
            this.storage.value[selector] = {
                index: this.ruleLength++,
                rule: ruletext,
            };
        }
        rules[selector] = ruletext;
        this.storage.store();
    };

    /**
     * Replace the entire stylesheet with a new CSS string.
     * @param {string} str - The new CSS string to set in the stylesheet.
     * @returns {void}
     */
    this.setString = (str) => {
        if (this.element.textContent === str) {
            return;
        }
        this.element.sheet.replaceSync(str);
        rules = {};
        for (let i = 0; i < this.element.sheet.cssRules.length; i++) {
            let rule = this.element.sheet.cssRules[i];
            let selector = rule.cssText.split("{")[0].trim();
            let ruleText = rule.cssText.split("{", 2)[1].trim();
            rules[selector] = ruleText;
        }
    };
}
