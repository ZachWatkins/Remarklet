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
import state from "../state.js";

/**
 * Stylesheet Module
 * @constructor
 * @param {Object} [options] - Options for the stylesheet. Optional.
 * @param {string[][]} [options.rules] - An array of rules to add to the stylesheet. Each rule is an array of two strings: the selector and the rule.
 * @param {string} [options.rules[].0] - The selector for the rule.
 * @param {string} [options.rules[].1] - The rule to apply to the selector.
 * @param {object} options.persist - If present, will persist the stylesheet to localStorage and pass the given options to the LocalStorageItem constructor.
 * @param {boolean} options.persist.key - The key for localStorage.
 * @param {object} options.persist.extras - Additional properties to store in localStorage.
 */
export default function Stylesheet(options) {
    this.persist = options && typeof options.persist === "object";

    if (!this.persist) {
        this.storage = {
            value: {
                rules: [],
            },
        };
    } else if (typeof options.persist.extras === "object") {
        this.storage = new LocalStorageItem({
            key: options.persist.key,
            type: "object",
            defaultValue: {
                ...options.persist.extras,
                rules: [],
            },
        });
    } else {
        this.storage = new LocalStorageItem({
            key: options.persist.key,
            type: "object",
            defaultValue: {
                rules: [],
            },
        });
    }

    this.element = document.createElement("style");
    document.head.appendChild(this.element);

    /**
     * Set a CSS rule in the stylesheet.
     * @param {string} selector - The CSS selector to set the rule for.
     * @param {string} rule - The CSS rule to set.
     * @returns {void}
     */
    this.setRule = (selector, rule) => {
        var ruletext = selector + "{\n" + rule + "\n}";
        const rules = this.element.sheet.cssRules;
        var foundIndex = false;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === selector) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex !== false) {
            this.element.sheet.deleteRule(foundIndex);
        }
        this.element.sheet.insertRule(ruletext);
        if (this.persist) {
            let found = false;
            for (let i = 0; i < this.storage.value.rules.length; i++) {
                if (this.storage.value.rules[i].selector === selector) {
                    found = true;
                    this.storage.value.rules[i].rule = rule;
                    break;
                }
            }
            if (!found) {
                this.storage.value.rules.push({
                    selector: selector,
                    rule: rule,
                });
            }
            this.storage.store();
        }
    };

    for (let i = 0; i < this.storage.value.rules.length; i++) {
        let rule = this.storage.value.rules[i];
        this.setRule(rule.selector, rule.rule);
    }

    if (options && Array.isArray(options.rules)) {
        for (let i = 0; i < options.rules.length; i++) {
            let rule = options.rules[i];
            this.setRule(rule[0], rule[1]);
        }
    }

    if (this.storage.store) {
        this.storage.store();
    }

    state.publish("stylesheet.initialized");
}
