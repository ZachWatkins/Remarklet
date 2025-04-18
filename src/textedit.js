import state from "./state.js";
import changeMap from "./changeMap.js";

/**
 * Initialize text editing functionality for the library.
 * @returns {void}
 */
export default function main() {
    let currentEditableElement = null;

    state.subscribe("target", (target, oldTarget) => {
        if (!state.get("active")) {
            if (currentEditableElement) {
                currentEditableElement.removeAttribute("contenteditable");
                currentEditableElement.removeEventListener(
                    "input",
                    handleInput,
                );
                currentEditableElement.removeEventListener(
                    "focus",
                    handleFocus,
                );
                currentEditableElement.removeEventListener("blur", handleBlur);
                currentEditableElement = null;
            }
            return;
        }
        const mode = state.get("mode");
        if (mode === "editing" || mode === "textediting") {
            if (currentEditableElement) {
                currentEditableElement.removeAttribute("contenteditable");
                currentEditableElement.removeEventListener(
                    "input",
                    handleInput,
                );
                currentEditableElement.removeEventListener(
                    "focus",
                    handleFocus,
                );
                currentEditableElement.removeEventListener("blur", handleBlur);
                currentEditableElement = null;
            }
            if (target) {
                currentEditableElement = target;
                currentEditableElement.setAttribute("contenteditable", "true");
                currentEditableElement.addEventListener("input", handleInput);
                currentEditableElement.addEventListener("focus", handleFocus);
                currentEditableElement.addEventListener("blur", handleBlur);
            }
        } else if (currentEditableElement) {
            currentEditableElement.removeAttribute("contenteditable");
            currentEditableElement.removeEventListener("input", handleInput);
            currentEditableElement.removeEventListener("focus", handleFocus);
            currentEditableElement.removeEventListener("blur", handleBlur);
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

function handleFocus(event) {
    state.set("mode", "textediting");
}
function handleBlur(event) {
    state.set("mode", "editing");
}
