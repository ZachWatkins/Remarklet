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
    this.element = document.createElement('style');
    var indent = '    ';
    var rules = {};
    this.setRule = function (selector, rule) {
        if (!rule) return;
        var ruletext,
            found = false,
            i = element.sheet.cssRules.length - 1;
        ruletext =
            '{\n' +
            indent +
            rule.replace(/; (\w)/g, ';\n' + indent + '$1') +
            '\n}';
        while (i >= 0) {
            if (selector == element.sheet.cssRules[i].selectorText) {
                found = element.sheet.cssRules[i];
                i = 0;
            }
            i--;
        }
        if (!found) {
            i = element.sheet.cssRules.length;
        }
        element.sheet.insertRule(selector + ruletext, i);
        rules[selector] = ruletext;
    };
    this.setString = function (str) {
        if (element.textContent === str) {
            return;
        }
        element.textContent = str;
        rules = {};
        for (let i = 0; i < element.cssRules.length; i++) {
            /** @type {CSSStyleRule} */
            let rule = element.cssRules[i];
            let selector = rule.cssText.split('{')[0].trim();
            let ruleText = rule.cssText.split('{', 2)[1].trim();
            rules[selector] = ruleText;
        }
    };
    if (value) {
        this.setString(value);
    }
}
