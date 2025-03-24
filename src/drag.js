import "@interactjs/auto-start/index.prod";
import "@interactjs/actions/drag/index.prod";
import "@interactjs/actions/resize/index.prod";
// import '@interactjs/dev-tools'
import interact from "@interactjs/interact/index.prod";
import store from "./store.js";
import { resolveTransform, hasRotation } from "./utils/cssTransforms.js";

let interactable = null;
let inlineTarget = null;
let warnedOfRotation = false;
let position = { x: 0, y: 0 };

export function main() {
    store.subscribe("target", (target) => {
        if (interactable) {
            interactable.unset();
            interactable = null;
            if (!store.get("active")) {
                return;
            }
        }
        if (target && window.getComputedStyle(target).display !== "inline") {
            interactable = interact(target)
                .draggable(draggableOptions)
                .resizable(resizableOptions);
        }
    });
}

const draggableOptions = {
    autoScroll: true,
    listeners: {
        /**
         * Handles the drag start event
         * @param {DragEvent} event The drag start event
         * @param {HTMLElement} event.target The target element being dragged
         * @return {void}
         */
        start(event) {
            if (store.get("modifying")) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            store.set("mode", "dragging");
            // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
            if (window.getComputedStyle(event.target).display === "inline") {
                let parent = event.target.parentElement;
                while (
                    parent &&
                    window.getComputedStyle(parent).display === "inline"
                ) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    store.set("target", parent);
                    parent.setAttribute("data-remarklet-dragging", "true");
                    inlineTarget = event.target;
                }
            } else {
                event.target.setAttribute("data-remarklet-dragging", "true");
            }
            position.x = 0;
            position.y = 0;
        },
        /**
         * Handles the drag move event
         * @param {DragEvent} event The drag move event
         * @param {HTMLElement} event.target The target element being dragged
         * @return {void}
         */
        move(event) {
            /** @type {HTMLElement} */
            var target = store.get("target");
            if (!target || target !== event.target) {
                return;
            }
            let x = position.x + event.dx;
            let y = position.y + event.dy;
            const resolved = resolveTransform(target, x, y);
            target.style.transform = resolved.style;
            position.x = resolved.x;
            position.y = resolved.y;
        },
        /**
         * Handles the drag end event
         * @param {DragEvent} event The drag end event
         * @param {HTMLElement} event.target The target element being dragged
         * @return {void}
         */
        end(event) {
            event.stopPropagation();
            event.preventDefault();
            const target = store.get("target");
            if (!target) {
                return;
            }
            target.removeAttribute("data-remarklet-dragging");
            if (event.target === inlineTarget) {
                store.set("target", inlineTarget);
                inlineTarget = null;
            }
            store.set("mode", "edit");
            position.x = 0;
            position.y = 0;
        },
    },
};

const resizableOptions = {
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
        start(event) {
            if (store.get("modifying")) {
                return;
            }
            // An inline element cannot be resized. I can't decide the least surprising behavior here.
            store.set("mode", "resizing");
            event.target.setAttribute("data-remarklet-resizing", "true");
        },
        move(event) {
            const target = event.target;
            if (hasRotation(target) && !warnedOfRotation) {
                warnedOfRotation = true;
                console.warn(
                    "Remarklet does not yet support resizing rotated elements.",
                );
            }
            if (event.edges.left || event.edges.right) {
                target.style.width = resolveWidth(target, event.rect.width);
            } else if (event.edges.top || event.edges.bottom) {
                target.style.height = resolveHeight(target, event.rect.height);
            }

            // const rect = target.getBoundingClientRect();
            // if (event.rect.height === rect.height) {
            //     // Element is not rotated.
            //     target.style.width = resolveWidth(target, event.rect.width);
            //     target.style.height = resolveHeight(target, event.rect.height);
            // } else {
            //     // Element is rotated.
            //     target.style.width = resolveWidth(target, event.rect.height);
            //     target.style.height = resolveHeight(target, event.rect.width);
            // }
            // const x =
            //     (parseFloat(target.getAttribute("data-remarklet-x")) || 0) + event.deltaRect.left;
            // const y =
            //     (parseFloat(target.getAttribute("data-remarklet-y")) || 0) + event.deltaRect.top;
            // const originalTransform = target.getAttribute("data-remarklet-original-transform");
            // const resolved = resolveTransform(target, x, y, originalTransform);
            // target.style.transform = resolved.style;
            // target.setAttribute("data-remarklet-x", resolved.x);
            // target.setAttribute("data-remarklet-y", resolved.y);
        },
        end(event) {
            store.set("mode", "edit");
            event.target.removeAttribute("data-remarklet-resizing");
        },
    },
};

/**
 * The totalWidth does not consider the CSS box-sizing property.
 * @param {HTMLElement} target The target element
 * @param {number} totalWidth The total width of the element
 * @returns {string} The resolved width in px
 */
function resolveWidth(target, totalWidth) {
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.boxSizing === "border-box") {
        return `${totalWidth}px`;
    }
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    return `${totalWidth - paddingLeft - paddingRight}px`;
}

/**
 * The totalHeight does not consider the CSS box-sizing property.
 * @param {HTMLElement} target The target element
 * @param {number} totalWidth The total height of the element
 * @returns {string} The resolved height in px
 */
function resolveHeight(target, totalHeight) {
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.boxSizing === "border-box") {
        return `${totalHeight}px`;
    }
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    return `${totalHeight - paddingTop - paddingBottom}px`;
}

export default main;
