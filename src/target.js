/**
 * @module highlight
 * @description Adds mouseenter/mouseleave event handlers that add outline styles when hovering over elements and removes them when leaving elements.
 */
import state from "./state.js";

const mouseEnterStack = [];

/**
 * Adds mouse event handlers to all elements in the document
 */
export default function main() {
    state.subscribe("active", (active) => {
        if (active) {
            document.addEventListener("mouseenter", handleMouseEnter, true);
            document.addEventListener("mouseleave", handleMouseLeave, true);
        } else {
            document.removeEventListener("mouseenter", handleMouseEnter, true);
            document.removeEventListener("mouseleave", handleMouseLeave, true);
        }
    });
    state.subscribe("target", (target, oldTarget) => {
        if (!state.get("active")) {
            if (target) {
                target.removeAttribute("data-remarklet-highlight");
            }
            if (oldTarget) {
                oldTarget.removeAttribute("data-remarklet-highlight");
            }
            return;
        }
        target?.setAttribute("data-remarklet-highlight", "true");
        oldTarget?.removeAttribute("data-remarklet-highlight");
    });
}

/**
 * Handles the mouseenter event
 * @param {MouseEvent} event The mouseenter event
 */
function handleMouseEnter(event) {
    if (event.target === document.documentElement || event.target === document.body) {
        return;
    }
    event.stopPropagation();
    if (event.target.classList && !state.get("modifying")) {
        state.set("target", event.target);
        mouseEnterStack.push(event.target);
    }
}

/**
 * Handles the mouseleave event
 * @param {MouseEvent} event The mouseleave event
 */
function handleMouseLeave(event) {
    if (event.target === document.documentElement || event.target === document.body) {
        return;
    }
    event.stopPropagation();
    if (event.target.classList && !state.get("modifying")) {
        const index = mouseEnterStack.indexOf(event.target);
        if (index !== -1) {
            mouseEnterStack.splice(index, 1);
            if (mouseEnterStack.length === 0) {
                state.set("target", null);
            } else {
                state.set(
                    "target",
                    mouseEnterStack[mouseEnterStack.length - 1],
                );
            }
        }
    }
}
