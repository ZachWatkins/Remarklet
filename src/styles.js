/**
 * @module styles
 * Add a stylesheet to the document containing the library's styles.
 */
import state from "./state.js";
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
        "outline: 2px solid #00b3dd; touch-action: none !important; user-select: none !important;",
    );
    sheet.setRule(
        "[data-remarklet-dragging], [data-remarklet-resizing]",
        "touch-action: none !important; user-select: none !important; transition: none !important; animation: none !important;",
    );
    if (state.get("persist") === true) {
        changeMap.each((elementState) => {
            sheet.setRule(elementState.selector, elementState.rule);
        });
    }
    state.subscribe("mode", (mode) => {
        document.body.setAttribute("data-remarklet-mode", mode);
    });
    return sheet;
}
