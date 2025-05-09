/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// Add a stylesheet to the document containing the library's styles.
import config from "./config.js";
import Stylesheet from "./utils/stylesheet.js";
import changeMap from "./changeMap.js";
let sheet = null;

/**
 * Create the stylesheet element, append it to the document head, and set up a subscription to the state.
 * @returns {Stylesheet} The stylesheet element.
 */
export default function main() {
    if (sheet) {
        return sheet;
    }
    sheet = new Stylesheet();
    sheet.setRule(
        "[data-remarklet-highlight]",
        "outline: 2px solid #00b3dd !important; touch-action: none !important; user-select: none !important;",
    );
    sheet.setRule(
        "[data-remarklet-dragging], [data-remarklet-resizing]",
        "touch-action: none !important; user-select: none !important; transition: none !important; animation: none !important;",
    );
    if (config.persist) {
        changeMap.each((elementState) => {
            sheet.setRule(elementState.selector, elementState.rule);
        });
    }
    return sheet;
}
