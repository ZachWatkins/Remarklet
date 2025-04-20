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

    this.storage = {
        value: {
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
    }

    this.element = document.createElement("style");
    document.head.appendChild(this.element);

    /**
     * Detect whether a selector has a rule in the stylesheet.
     * @param {string} selector - The CSS selector to check.
     * @returns {boolean} - True if the selector has a rule, false otherwise.
     */
    this.hasRule = (selector) => {
        const rules = this.element.sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === selector) {
                return true;
            }
        }
        return false;
    };

    /**
     * Retrieve a CSS rule from the stylesheet given a selector.
     * @param {string} selector - The CSS selector to retrieve the rule for.
     * @returns {string | null} - The CSS rule for the selector, or null if not found.
     */
    this.getRule = (selector) => {
        const rules = this.element.sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === selector) {
                return rules[i].style.cssText;
            }
        }
        return null;
    };

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
        try {
            this.element.sheet.insertRule(ruletext);
        } catch (e) {
            console.error("Error inserting rule:", ruletext, e);
            return;
        }
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

    /**
     * Merge a new CSS rule in the stylesheet with the existing rule. New rule values replace existing rule values. If a rule does not exist with the given selector, it will be added.
     * @param {string} selector - The CSS selector to set the rule for.
     * @param {string} rule - The CSS rule to set.
     * @returns {void}
     */
    this.mergeRule = (selector, rule) => {
        var foundIndex = false;
        const rules = this.element.sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].selectorText === selector) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex === false) {
            this.setRule(selector, rule);
            return;
        }
        // Merge styles with the existing rule.
        // First, get the existing rule and parse it into an object.
        const existingRule = rules[foundIndex].style;
        const combinedRules = {};
        for (let i = 0; i < existingRule.length; i++) {
            const property = existingRule[i];
            combinedRules[property] = existingRule.getPropertyValue(property);
        }
        // Then, parse the new rule into an object.
        const newRule = rule.split(";");
        for (let i = 0; i < newRule.length; i++) {
            const property = newRule[i].split(":");
            if (property.length === 2) {
                combinedRules[property[0].trim()] = property[1].trim();
            }
        }
        // Finally, set the rule with the combined properties.
        let combinedRule = Object.entries(combinedRules)
            .map(([key, value]) => `${key}: ${value}`)
            .join(";");
        if (combinedRule) {
            combinedRule += ";";
        }
        this.setRule(selector, combinedRule);
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

    if (typeof this.storage.store === "function") {
        this.storage.store();
    }

    state.publish("stylesheet.initialized");
}
