import state from "./state.js";
import changeMap from "./changeMap.js";
import preventDefaultEvents from "./utils/preventDefaultEvents.js";

let preventEvents = null;
const enabledModes = { editing: true, textediting: true };
/**
 * The active edit target. Changes on focus.
 * @type {HTMLElement|null}
 */
let editTarget = null;
/**
 * The next edit target. Changes on target change.
 * @type {HTMLElement|null}
 */
let nextEditTarget = null;

/**
 * Initialize text editing functionality for the library.
 * @returns {void}
 */
export default function main() {
    preventEvents = new preventDefaultEvents(["click"]);

    // Target changes on mouse enter.
    state.subscribe("target", (target, oldTarget) => {
        if (state.get("active") && enabledModes[state.get("mode")]) {
            if (target) {
                if (!preventEvents.isOn) {
                    preventEvents.on();
                }
                if (nextEditTarget) {
                    removeEvents(nextEditTarget);
                    nextEditTarget.removeAttribute("contenteditable");
                }
                nextEditTarget = target;
                addEvents(nextEditTarget);
                nextEditTarget.setAttribute("contenteditable", "true");
            } else if (nextEditTarget) {
                removeEvents(nextEditTarget);
                nextEditTarget.removeAttribute("contenteditable");
                nextEditTarget = null;
            }
        } else {
            if (editTarget) {
                removeEvents(editTarget);
                editTarget.removeAttribute("contenteditable");
                editTarget = null;
            }
            if (nextEditTarget) {
                removeEvents(nextEditTarget);
                nextEditTarget.removeAttribute("contenteditable");
                nextEditTarget = null;
            }
            preventEvents.off();
        }
    });

    // Restore edited content if persist is true.
    if (state.get("persist") === true) {
        changeMap.each((elementState) => {
            if (typeof elementState.content === "string") {
                const selector = elementState.selector;
                const target = document.querySelector(selector);
                if (target) {
                    target.innerHTML = elementState.content;
                }
            }
        });
    }
}

/**
 * Handle input events on contenteditable elements
 * @param {Event} event - The input event object
 * @returns {void}
 */
function handleInput(event) {
    changeMap.init(event.target, "edited");
    if (!state.get("persist")) {
        return;
    }
    changeMap.get(event.target).content = event.target.innerHTML;
    changeMap.sync(event.target);
}

/**
 * Handle focus events on contenteditable elements
 * @param {Event} event - The focus event object
 * @returns {void}
 */
function handleFocus(event) {
    state.set("mode", "textediting");
    if (event.target !== editTarget) {
        if (editTarget) {
            removeEvents(editTarget);
            editTarget.removeAttribute("contenteditable");
        }
        editTarget = event.target;
        if (nextEditTarget) {
            nextEditTarget = null;
        }
    }
}

/**
 * Handle blur events on contenteditable elements
 * @param {Event} event - The blur event object
 * @returns {void}
 */
function handleBlur(event) {
    state.set("mode", "editing");
}

/**
 * Handle keydown events on contenteditable elements
 * @param {Event} event - The keydown event object
 * @returns {void}
 */
function handleKeydown(event) {
    if (event.key === "Escape" && editTarget === event.target) {
        event.preventDefault();
        event.stopPropagation();
        editTarget.removeAttribute("contenteditable");
        state.set("mode", "editing");
    }
}

/**
 * Handle mousedown events to set the contenteditable attribute.
 * @param {Event} event - The mousedown event object
 * @returns {void}
 */
function handleMousedown(event) {
    const target = event.target;
    if (
        target &&
        target instanceof HTMLElement &&
        !target.hasAttribute("contenteditable")
    ) {
        target.setAttribute("contenteditable", "true");
    }
}

/**
 * Attach contenteditable attribute and event handlers to an element.
 * @param {Element|null} element - The element to attach events to
 * @returns {void}
 */
function addEvents(element) {
    if (!element) {
        return;
    }
    element.addEventListener("input", handleInput);
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("keydown", handleKeydown);
    element.addEventListener("mousedown", handleMousedown);
}

/**
 * Remove contenteditable attribute and event handlers from an element.
 * @param {Element|null} element - The element to clean up
 * @returns {void}
 */
function removeEvents(element) {
    if (!element) {
        return;
    }
    element.removeEventListener("input", handleInput);
    element.removeEventListener("focus", handleFocus);
    element.removeEventListener("blur", handleBlur);
    element.removeEventListener("keydown", handleKeydown);
    element.removeEventListener("mousedown", handleMousedown);
}
