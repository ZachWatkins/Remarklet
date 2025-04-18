import state from "./state.js";
import changeMap from "./changeMap.js";

export default function main() {
    let currentEditableElement = null;

    state.subscribe("target", (target, oldTarget) => {
        if (!state.get("active")) {
            cleanupEditableElement(currentEditableElement);
            currentEditableElement = null;
            return;
        }
        const mode = state.get("mode");
        if (mode === "editing" || mode === "textediting") {
            cleanupEditableElement(currentEditableElement);
            currentEditableElement = null;
            if (target) {
                currentEditableElement = target;
                currentEditableElement.setAttribute("contenteditable", "true");
                currentEditableElement.addEventListener("input", handleInput);
                currentEditableElement.addEventListener("focus", handleFocus);
                currentEditableElement.addEventListener("blur", handleBlur);
            }
        } else {
            cleanupEditableElement(currentEditableElement);
            currentEditableElement = null;
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

/**
 * Remove contenteditable attribute and event handlers from an element.
 * @param {Element|null} element - The element to clean up
 * @returns {void}
 */
function cleanupEditableElement(element) {
    if (!element) {
        return;
    }
    element.removeAttribute("contenteditable");
    element.removeEventListener("input", handleInput);
    element.removeEventListener("focus", handleFocus);
    element.removeEventListener("blur", handleBlur);
}
