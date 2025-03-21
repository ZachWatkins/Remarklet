/**
 * @module highlight
 * @description Adds mouseenter/mouseleave event handlers that add outline styles when hovering over elements and removes them when leaving elements.
 */
import store from "./store.js";

const mouseEnterStack = [];

/**
 * Adds mouse event handlers to all elements in the document
 */
export default function main() {
    store.subscribe("active", (active) => {
        if (active) {
            document.addEventListener("mouseenter", handleMouseEnter, true);
            document.addEventListener("mouseleave", handleMouseLeave, true);
        } else {
            document.removeEventListener("mouseenter", handleMouseEnter, true);
            document.removeEventListener("mouseleave", handleMouseLeave, true);
        }
    });
    store.subscribe("target", (target, oldTarget) => {
        if (!store.get("active")) {
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
    event.stopPropagation();
    if (event.target.classList && !store.get("modifying")) {
        store.set("target", event.target);
        mouseEnterStack.push(event.target);
    }
}

/**
 * Handles the mouseleave event
 * @param {MouseEvent} event The mouseleave event
 */
function handleMouseLeave(event) {
    event.stopPropagation();
    if (event.target.classList && !store.get("modifying")) {
        const index = mouseEnterStack.indexOf(event.target);
        if (index !== -1) {
            mouseEnterStack.splice(index, 1);
            if (mouseEnterStack.length === 0) {
                store.set("target", null);
            } else {
                store.set("target", mouseEnterStack[mouseEnterStack.length - 1]);
            }
        }
    }
}
