import "@interactjs/auto-start/index.prod";
import "@interactjs/actions/drag/index.prod";
import "@interactjs/actions/resize/index.prod";
// import '@interactjs/dev-tools'
import interact from "@interactjs/interact/index.prod";
import state from "./state.js";
import styles from "./styles.js";
import changeMap from "./changeMap.js";
import { resolveTransform, hasRotation } from "./utils/cssTransforms.js";

let interactable = null;
let inlineTarget = null;
let warnedOfRotation = false;

export function main() {
    state.subscribe("target", (target) => {
        if (interactable) {
            interactable.unset();
            interactable = null;
            if (!state.get("active")) {
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
            if (state.get("modifying")) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            state.set("mode", "dragging");
            // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
            if (window.getComputedStyle(event.target).display === "inline") {
                /** @type {HTMLElement} */
                let parent = event.target.parentElement;
                while (
                    parent &&
                    window.getComputedStyle(parent).display === "inline"
                ) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    state.set("target", parent);
                    changeMap.init(parent, "dragged");
                    parent.setAttribute("data-remarklet-dragging", "true");
                    inlineTarget = event.target;
                }
            } else {
                event.target.setAttribute("data-remarklet-dragging", "true");
                changeMap.init(event.target, "dragged");
            }
        },
        /**
         * Handles the drag move event
         * @param {DragEvent} event The drag move event
         * @param {HTMLElement} event.target The target element being dragged
         * @return {void}
         */
        move(event) {
            /** @type {HTMLElement} */
            var target = state.get("target");
            if (!target || target !== event.target) {
                return;
            }
            const map = changeMap.get(target);
            map.move(event.dx, event.dy);
            target.style.transform = map.transformText;
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
            const target = state.get("target");
            if (!target) {
                return;
            }
            changeMap.sync(target);
            target.removeAttribute("data-remarklet-dragging");
            if (event.target === inlineTarget) {
                state.set("target", inlineTarget);
                inlineTarget = null;
            }
            state.set("mode", "editing");

            // Apply the changes to the stylesheet.
            const map = changeMap.get(target);
            styles().mergeRule(map.selector, map.rule);

            // Restore the inline style, if any.
            const initialStyle = map.initialStyle;
            if (initialStyle) {
                target.style.cssText = initialStyle;
            } else {
                target.removeAttribute("style");
            }
        },
    },
};

const resizableOptions = {
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
        start(event) {
            if (state.get("modifying")) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            // An inline element cannot be resized. I can't decide the least surprising behavior here.
            state.set("mode", "resizing");
            event.target.setAttribute("data-remarklet-resizing", "true");
            changeMap.init(event.target, "resized");
        },
        move(event) {
            const target = event.target;
            if (hasRotation(target) && !warnedOfRotation) {
                warnedOfRotation = true;
                console.warn(
                    "Remarklet does not yet support resizing rotated elements.",
                );
            }
            const map = changeMap.get(target);
            let newStyles = {};
            if (event.edges.left || event.edges.right) {
                map.width = map.width + event.deltaRect.width;
                newStyles.width = `${map.width}px`;
            }
            if (event.edges.top || event.edges.bottom) {
                map.height = map.height + event.deltaRect.height;
                newStyles.height = `${map.height}px`;
            }
            if (event.deltaRect.left !== 0 || event.deltaRect.top !== 0) {
                map.move(event.deltaRect.left, event.deltaRect.top);
                newStyles.transform = map.transformText;
            }
            if (map.dragged) {
                // We need to update the margin so sibling elements do not change their position, effectively locking in the space occupied by the element to its original dimensions.
                map.marginBottom = map.marginBottom - event.deltaRect.height;
                map.marginRight = map.marginRight - event.deltaRect.width;
                newStyles.marginBottom = `${map.marginBottom}px`;
                newStyles.marginRight = `${map.marginRight}px`;
            }
            for (const key in newStyles) {
                target.style[key] = newStyles[key];
            }
        },
        end(event) {
            state.set("mode", "editing");

            // Apply the changes to the stylesheet.
            const target = event.target;
            changeMap.sync(target);
            const map = changeMap.get(target);
            styles().mergeRule(map.selector, map.rule);

            // Restore the inline style, if any.
            const initialStyle = map.initialStyle;
            if (initialStyle) {
                target.style.cssText = initialStyle;
            } else {
                target.removeAttribute("style");
            }

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
