import "@interactjs/auto-start/index.prod";
import "@interactjs/actions/drag/index.prod";
import "@interactjs/actions/resize/index.prod";
import "@interactjs/modifiers/index.prod";
// import '@interactjs/dev-tools'
import interact from "@interactjs/interact/index.prod";
import store from "./store.js";

let interactable = null;
let inlineTarget = null;
let warnedOfRotation = false;

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
            interactable = interact(target).draggable(draggableOptions).resizable(resizableOptions);
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
            if (event.target.getAttribute("data-remarklet-original-transform") === null) {
                event.target.setAttribute(
                    "data-remarklet-original-transform",
                    window.getComputedStyle(event.target).transform,
                );
            }
            // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
            if (window.getComputedStyle(event.target).display === "inline") {
                let parent = event.target.parentElement;
                while (parent && window.getComputedStyle(parent).display === "inline") {
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
            let x = (parseFloat(target.getAttribute("data-remarklet-x")) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute("data-remarklet-y")) || 0) + event.dy;
            const originalTransform = target.getAttribute("data-remarklet-original-transform");
            const resolved = resolveTransform(target, x, y, originalTransform);
            target.style.transform = resolved.style;
            target.setAttribute("data-remarklet-x", resolved.x);
            target.setAttribute("data-remarklet-y", resolved.y);
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
            if (event.target.getAttribute("data-remarklet-original-transform") === null) {
                event.target.setAttribute(
                    "data-remarklet-original-transform",
                    window.getComputedStyle(event.target).transform,
                );
            }
        },
        move(event) {
            const target = event.target;
            if (hasRotation(target) && !warnedOfRotation) {
                warnedOfRotation = true;
                console.warn("Remarklet does not yet support resizing rotated elements.");
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

/**
 * Detect whether the element uses a rotation transform CSS property.
 * @param {HTMLElement} target The target element
 * @return {boolean} True if the element uses a rotation transform CSS property
 */
function hasRotation(target) {
    const transform = window.getComputedStyle(target).transform;
    if (transform === "none") {
        return false;
    }
    // Test for rotate, matrix, and matrix3d.
    const rotateRegex = /rotate\(([^)]+)\)/;
    const rotateMatch = transform.match(rotateRegex);
    if (rotateMatch) {
        return true;
    }
    const matrixRegex = /matrix\(([^)]+)\)/;
    const matrixMatch = transform.match(matrixRegex);
    if (matrixMatch) {
        const matrixValues = matrixMatch[1].split(",");
        const a = parseFloat(matrixValues[0]);
        const b = parseFloat(matrixValues[1]);
        if (Math.abs(a) !== 1 || Math.abs(b) !== 0) {
            return true;
        }
    }
    const matrix3dRegex = /matrix3d\(([^)]+)\)/;
    const matrix3dMatch = transform.match(matrix3dRegex);
    if (matrix3dMatch) {
        const matrix3dValues = matrix3dMatch[1].split(",");
        const a = parseFloat(matrix3dValues[0]);
        const b = parseFloat(matrix3dValues[1]);
        if (Math.abs(a) !== 1 || Math.abs(b) !== 0) {
            return true;
        }
    }
    return false;
}

function resolveTransform(target, x, y, originalTransform) {
    let style = "";
    if ("none" === originalTransform) {
        style = `translate(${x}px, ${y}px)`;
    } else if (target.hasAttribute("data-remarklet-x")) {
        style = target.style.transform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
    } else {
        if (originalTransform.indexOf("matrix3d") === -1) {
            if (originalTransform.indexOf("matrix") === -1) {
                if (originalTransform.indexOf("translate") === -1) {
                    // No other positioning transforms.
                    style = originalTransform + ` translate(${x}px, ${y}px)`;
                } else {
                    // Pre-existing positioning transform.
                    // Get the original translation values.
                    const translateRegex = /\btranslate\(([^)]+)\)/;
                    const translateMatch = originalTransform.match(translateRegex);
                    const translateValues = translateMatch
                        ? translateMatch[1].split(",")
                        : ["0px", "0px"];
                    // Determine the unit of the translation values.
                    const unitRegex = /[a-zA-Z%]+/;
                    const unitMatch = translateValues[0].match(unitRegex);
                    if (!unitMatch) {
                        // Invalid CSS unit, so ignore the original value.
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "px") {
                        // px unit, so it is safe to add the values.
                        x = parseFloat(translateValues[0]) + x;
                        y = parseFloat(translateValues[1]) + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "%") {
                        // % unit, so calculate the percentage of the element's width and height.
                        const width = target.offsetWidth;
                        const height = target.offsetHeight;
                        x = (parseFloat(translateValues[0]) / 100) * width + x;
                        y = (parseFloat(translateValues[1]) / 100) * height + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "em") {
                        // em unit, so calculate the percentage of the element's font size.
                        const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
                        x = parseFloat(translateValues[0]) * fontSize + x;
                        y = parseFloat(translateValues[1]) * fontSize + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else {
                        // Unknown unit.
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    }
                }
            } else if (originalTransform.indexOf("translate") === -1) {
                // Put the translation at the beginning.
                style = `translate(${x}px, ${y}px) ` + originalTransform;
            } else {
                // Pre-existing positioning transform.
                // Get the original translation values.
                const translateRegex = /\btranslate\(([^)]+)\)/;
                const translateMatch = originalTransform.match(translateRegex);
                const translateValues = translateMatch
                    ? translateMatch[1].split(",")
                    : ["0px", "0px"];
                // Determine the unit of the translation values.
                const unitRegex = /[a-zA-Z%]+/;
                const unitMatch = translateValues[0].match(unitRegex);
                if (!unitMatch) {
                    // Invalid CSS unit, so ignore the original value.
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "px") {
                    // px unit, so we can safely add the values.
                    x = parseFloat(translateValues[0]) + x;
                    y = parseFloat(translateValues[1]) + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "%") {
                    // % unit, so we need to calculate the percentage of the element's width and height.
                    const width = target.offsetWidth;
                    const height = target.offsetHeight;
                    x = (parseFloat(translateValues[0]) / 100) * width + x;
                    y = (parseFloat(translateValues[1]) / 100) * height + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "em") {
                    // em unit, so we need to calculate the percentage of the element's font size.
                    const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
                    x = parseFloat(translateValues[0]) * fontSize + x;
                    y = parseFloat(translateValues[1]) * fontSize + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else {
                    // Unknown unit, so we can't do anything.
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                }
            }
        } else if (originalTransform.indexOf("translate") === -1) {
            // Put the translation at the beginning.
            style = `translate(${x}px, ${y}px) ` + originalTransfor;
        } else {
            // Pre-existing positioning transform.
            // Get the original translation values.
            const translateRegex = /\btranslate\(([^)]+)\)/;
            const translateMatch = originalTransform.match(translateRegex);
            const translateValues = translateMatch ? translateMatch[1].split(",") : ["0px", "0px"];
            // Determine the unit of the translation values.
            const unitRegex = /[a-zA-Z%]+/;
            const unitMatch = translateValues[0].match(unitRegex);
            if (!unitMatch) {
                // Invalid CSS unit, so ignore the original value.
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "px") {
                // px unit, so we can safely add the values.
                x = parseFloat(translateValues[0]) + x;
                y = parseFloat(translateValues[1]) + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "%") {
                // % unit, so we need to calculate the percentage of the element's width and height.
                const width = target.offsetWidth;
                const height = target.offsetHeight;
                x = (parseFloat(translateValues[0]) / 100) * width + x;
                y = (parseFloat(translateValues[1]) / 100) * height + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "em") {
                // em unit, so we need to calculate the percentage of the element's font size.
                const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
                x = parseFloat(translateValues[0]) * fontSize + x;
                y = parseFloat(translateValues[1]) * fontSize + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else {
                // Unknown unit, so we can't do anything.
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            }
        }
    }
    return {
        x,
        y,
        style,
    };
}

export default main;
