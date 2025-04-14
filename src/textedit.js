import state from "./state.js";
import changeMap from "./changeMap.js";

/**
 * Initialize text editing functionality for the remarklet
 * Handles making elements editable and persisting their changes when needed
 * @returns {void}
 */
export default function main() {
    let currentEditableElement = null;

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

    /**
     * Handle input events on contenteditable elements
     * @param {Event} event - The input event object
     * @returns {void}
     */
    function handleInput(event) {
        if (!state.get("persist")) {
            return;
        }
        const target = event.target;
        changeMap.init(target, "edited");
        changeMap.get(target).content = target.innerHTML;
        changeMap.sync(target);
    }

    state.subscribe("target", (target, oldTarget) => {
        if (oldTarget) {
            oldTarget.removeAttribute("contenteditable");
            if (currentEditableElement === oldTarget) {
                oldTarget.removeEventListener("input", handleInput);
                currentEditableElement = null;
            }
        }

        if (!state.get("active")) {
            return;
        }

        if (target && "editing" === state.get("mode")) {
            target.setAttribute("contenteditable", "true");
            target.addEventListener("input", handleInput);
            currentEditableElement = target;
        }
    });

    state.subscribe("mode", (mode) => {
        const target = state.get("target");

        if (mode === "editing") {
            if (target) {
                target.setAttribute("contenteditable", "true");
                target.addEventListener("input", handleInput);
                currentEditableElement = target;
            }
        } else {
            if (target && target.hasAttribute("contenteditable")) {
                target.removeAttribute("contenteditable");
                target.removeEventListener("input", handleInput);
                currentEditableElement = null;
            }
        }
    });
}
