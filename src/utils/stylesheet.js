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
export default function Stylesheet(value) {
    this.element = document.createElement("style");
    this.element.innerText = value || "";
    var indent = "    ";
    var rules = {};
    this.setRule = (selector, rule) => {
        if (!rule) return;
        var ruletext,
            found = false,
            i = this.element.sheet.cssRules.length - 1;
        ruletext =
            "{\n" +
            indent +
            rule.replace(/; (\w)/g, ";\n" + indent + "$1") +
            "\n}";
        while (i >= 0) {
            if (selector == this.element.sheet.cssRules[i].selectorText) {
                found = this.element.sheet.cssRules[i];
                i = 0;
            }
            i--;
        }
        if (!found) {
            i = this.element.sheet.cssRules.length;
        }
        this.element.sheet.insertRule(selector + ruletext, i);
        rules[selector] = ruletext;
    };
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
