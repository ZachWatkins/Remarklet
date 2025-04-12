/**
 * @module styles
 * Add a stylesheet to the document containing the library's styles.
 */
import pkg from "../package.json" with { type: "json" };
import state from "./state.js";
import Stylesheet from "./utils/stylesheet.js";
let sheet = null;

/**
 * Create the stylesheet element, append it to the document head, and set up a subscription to the state.
 * @returns {Stylesheet} The stylesheet element.
 */
export default function main() {
    if (sheet) {
        return sheet;
    }
    const rules = [
        [
            "[data-remarklet-highlight]",
            "outline: 2px solid #00b3dd; touch-action: none !important; user-select: none !important;",
        ],
        [
            "[data-remarklet-dragging], [data-remarklet-resizing]",
            "touch-action: none !important; user-select: none !important; transition: none !important; animation: none !important;",
        ],
    ];
    if (state.get("persist") === true) {
        sheet = new Stylesheet({
            persist: {
                key: "remarklet-stylesheet",
                extras: { version: pkg.version },
            },
            rules,
        });
    } else {
        sheet = new Stylesheet({ rules });
    }
    state.subscribe("mode", (mode) => {
        document.body.setAttribute("data-remarklet-mode", mode);
    });
    return sheet;
}
