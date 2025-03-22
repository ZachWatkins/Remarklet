/**
 * @module styles
 * Add a stylesheet to the document containing the library's styles.
 */
import store from "./store.js";
import Stylesheet from "./utils/stylesheet.js";

export default function main() {
    const stylesheet = new Stylesheet(`
[data-remarklet-highlight] {
    outline: 2px solid #00b3dd;
}
[data-remarklet-dragging],
[data-remarklet-resizing] {
    touch-action: none !important;
    user-select: none !important;
    transition: none !important;
    animation: none !important;
}
`);
    document.head.appendChild(stylesheet.element);

    store.subscribe("mode", (mode, lastMode) => {
        // When the mode is resizing or dragging, add a style to the body using the stylesheet that gives it "user-select: none".
        if ("dragging" === mode) {
            document.body.setAttribute("data-remarklet-dragging", "true");
            if ("resizing" === lastMode) {
                document.body.removeAttribute("data-remarklet-resizing");
            }
        } else if ("resizing" === mode) {
            document.body.setAttribute("data-remarklet-resizing", "true");
            if ("dragging" === lastMode) {
                document.body.removeAttribute("data-remarklet-dragging");
            }
        }
    });
}
