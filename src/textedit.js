import state from "./state.js";
import changeMap from "./changeMap.js";
import preventDefaultEvents from "./utils/preventDefaultEvents.js";

let currentEditableElement = null;
let preventEvents = null;

/**
 * Initialize text editing functionality for the library.
 * @returns {void}
 */
export default function main() {
    preventEvents = new preventDefaultEvents(["click"]);

    state.subscribe("target", (target, oldTarget) => {
        if (!state.get("active")) {
            cleanupEditableElement(currentEditableElement);
            // TODO: make this only target elements whose contenteditable attribute was set by this library and changed from an initial value of undefined/false (i.e. not set on the element when the library was loaded).
            // For now we unset all elements' contenteditable attribute.
            const elements = document.querySelectorAll("[contenteditable]");
            elements.forEach((element) => {
                element.removeAttribute("contenteditable");
            });
            currentEditableElement = null;
            preventEvents.off();
            return;
        }
        const mode = state.get("mode");
        if (mode === "editing" || mode === "textediting") {
            cleanupEditableElement(currentEditableElement);
            currentEditableElement = null;
            preventEvents.off();
            if (target) {
                currentEditableElement = target;
                setupEditableElement(currentEditableElement);
                preventEvents.on();
            }
        } else {
            cleanupEditableElement(currentEditableElement);
            currentEditableElement = null;
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
}

/**
 * Handle blur events on contenteditable elements
 * @param {Event} event - The blur event object
 * @returns {void}
 */
function handleBlur(event) {
    state.set("mode", "editing");
}

function setupEditableElement(element) {
    if (!element) {
        return;
    }
    element.setAttribute("contenteditable", "true");
    element.addEventListener("input", handleInput);
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
}

/**
 * Remove contenteditable attribute and event handlers from an element.
 * @param {Element|null} element - The element to clean up
 * @returns {void}
 */
function cleanupEditableElement(element) {
    if (!element) {
        return;
    }
    element.removeEventListener("input", handleInput);
    element.removeEventListener("focus", handleFocus);
    element.removeEventListener("blur", handleBlur);
}
