import "@interactjs/auto-start/index.prod";
import "@interactjs/actions/drag/index.prod";
import "@interactjs/actions/resize/index.prod";
// import '@interactjs/dev-tools'
import interact from "@interactjs/interact/index.prod";
import store from "./store.js";
import styles from "./styles.js";
import { getUniqueSelector } from "./utils/cssSelector.js";
import { resolveTransform, hasRotation } from "./utils/cssTransforms.js";

let interactable = null;
let inlineTarget = null;
let warnedOfRotation = false;
let elementChangeMap = new WeakMap();

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
                /** @type {HTMLElement} */
                let parent = event.target.parentElement;
                while (
                    parent &&
                    window.getComputedStyle(parent).display === "inline"
                ) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    store.set("target", parent);
                    if (!elementChangeMap.has(parent)) {
                        elementChangeMap.set(parent, {
                            position: {
                                x: 0,
                                y: 0,
                            },
                            selector: getUniqueSelector(parent, {
                                excludeDataAttributePrefix: "remarklet",
                            }),
                            style: {
                                transform: null,
                                width: null,
                                height: null,
                            },
                            initialStyle: parent.style.cssText,
                        });
                    }
                    parent.setAttribute("data-remarklet-dragging", "true");
                    inlineTarget = event.target;
                }
            } else {
                event.target.setAttribute("data-remarklet-dragging", "true");
                if (!elementChangeMap.has(event.target)) {
                    elementChangeMap.set(event.target, {
                        position: {
                            x: 0,
                            y: 0,
                        },
                        selector: getUniqueSelector(event.target, {
                            excludeDataAttributePrefix: "remarklet",
                        }),
                        style: {
                            transform: null,
                            width: null,
                            height: null,
                        },
                        initialStyle: event.target.style.cssText,
                    });
                }
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
            var target = store.get("target");
            if (!target || target !== event.target) {
                return;
            }
            let x = elementChangeMap.get(target).position.x + event.dx;
            let y = elementChangeMap.get(target).position.y + event.dy;
            const resolved = resolveTransform(target, x, y);
            target.style.transform = resolved.style;
            elementChangeMap.get(target).style.transform = resolved.style;
            elementChangeMap.get(target).position.x += event.dx;
            elementChangeMap.get(target).position.y += event.dy;
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

            // Apply the changes to the stylesheet.
            const selector = elementChangeMap.get(target).selector;
            const rule = `transform: ${elementChangeMap.get(target).style.transform};`;
            styles().setRule(selector, rule);

            // Restore the inline style, if any.
            const initialStyle = elementChangeMap.get(target).initialStyle;
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
            if (store.get("modifying")) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            // An inline element cannot be resized. I can't decide the least surprising behavior here.
            store.set("mode", "resizing");
            event.target.setAttribute("data-remarklet-resizing", "true");
            if (!elementChangeMap.has(event.target)) {
                elementChangeMap.set(event.target, {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    selector: getUniqueSelector(parent, {
                        excludeDataAttributePrefix: "remarklet",
                    }),
                    style: {
                        transform: null,
                        width: null,
                        height: null,
                    },
                    initialStyle: event.target.style.cssText,
                });
            }
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
                const resolvedWidth = resolveWidth(target, event.rect.width);
                target.style.width = resolvedWidth;
                elementChangeMap.get(target).style.width = resolvedWidth;
            } else if (event.edges.top || event.edges.bottom) {
                const resolvedHeight = resolveHeight(target, event.rect.height);
                target.style.height = resolvedHeight;
                elementChangeMap.get(target).style.height = resolvedHeight;
            }
            if (event.deltaRect.left !== 0 || event.deltaRect.top !== 0) {
                let x =
                    elementChangeMap.get(target).position.x +
                    event.deltaRect.left;
                let y =
                    elementChangeMap.get(target).position.y +
                    event.deltaRect.top;
                const resolved = resolveTransform(target, x, y);
                target.style.transform = resolved.style;
                elementChangeMap.get(target).style.transform = resolved.style;
                elementChangeMap.get(target).position.x += event.deltaRect.left;
                elementChangeMap.get(target).position.y += event.deltaRect.top;
            }
        },
        end(event) {
            store.set("mode", "edit");

            // Apply the changes to the stylesheet.
            const target = event.target;
            const selector = elementChangeMap.get(event.target).selector;
            const changeMap = elementChangeMap.get(target);
            let rule = [];
            if (changeMap.style.width) {
                rule.push(`width: ${changeMap.style.width}`);
            }
            if (changeMap.style.height) {
                rule.push(`height: ${changeMap.style.height}`);
            }
            if (changeMap.style.transform) {
                rule.push(`transform: ${changeMap.style.transform}`);
            }
            rule = rule.join("; ");
            if (rule) {
                styles().setRule(selector, rule);
            }

            // Restore the inline style, if any.
            const initialStyle = elementChangeMap.get(target).initialStyle;
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
