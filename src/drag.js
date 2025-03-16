import interact from "interactjs";
import store from "./store.js";

let interactable = null;
let inlineTarget = null;

export function main() {
    store.subscribe("target", (target) => {
        if (!store.get("active")) {
            if (interactable) {
                interactable.unset();
                interactable = null;
            }
            return;
        }
        if (interactable) {
            interactable.unset();
            interactable = null;
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
            if (target.getAttribute("data-remarklet-original-transform") === null) {
                target.setAttribute("data-remarklet-original-transform", window.getComputedStyle(target).transform);
            }
            // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
            if (window.getComputedStyle(event.target).display === "inline") {
                let parent = event.target.parentElement;
                while (parent && window.getComputedStyle(parent).display === "inline") {
                    parent = parent.parentElement;
                }
                if (parent) {
                    store.set("target", parent);
                    inlineTarget = event.target;
                }
            } else {
                store.set("target", event.target);
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
            if ('none' === originalTransform) {
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute("data-remarklet-x", x);
                target.setAttribute("data-remarklet-y", y);
            } else if (target.hasAttribute("data-remarklet-x")) {
                target.style.transform = target.style.transform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
                target.setAttribute("data-remarklet-x", x);
                target.setAttribute("data-remarklet-y", y);
            } else {
                // First time to set the transform.
                const resolved = resolveTransform(target, x, y, originalTransform);
                console.log(resolved);
                target.style.transform = resolved.style;
                target.setAttribute("data-remarklet-x", resolved.x);
                target.setAttribute("data-remarklet-y", resolved.y);
            }
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
            if (event.target === inlineTarget) {
                store.set("target", inlineTarget);
                inlineTarget = null;
                store.set("mode", "idle");
                return;
            }
            if (event.target !== target) {
                return;
            }
            store.set("mode", "idle");
        },
    },
};

const resizableOptions = {
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
        start(event) {
            // An inline element cannot be resized. I can't decide the least surprising behavior here.
            store.set("mode", "resizing");
        },
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute("remarklet-data-x")) || 0) + event.deltaRect.left;
            const y = (parseFloat(target.getAttribute("remarklet-data-y")) || 0) + event.deltaRect.top;

            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            target.style.transform = "translate(" + x + "px," + y + "px)";
            target.setAttribute("remarklet-data-x", x);
            target.setAttribute("remarklet-data-y", y);
        },
        end(event) {
            store.set("mode", "idle");
        },
    },
};

function resolveTransform(target, x, y, originalTransform) {
    let style = '';
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
                const translateValues = translateMatch ? translateMatch[1].split(",") : ['0px', '0px'];
                // Determine the unit of the translation values.
                const unitRegex = /[a-zA-Z%]+/;
                const unitMatch = translateValues[0].match(unitRegex);
                if (!unitMatch) {
                    // Invalid CSS unit, so ignore the original value.
                    style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
                } else if (unitMatch[0] === "px") {
                    // px unit, so it is safe to add the values.
                    x = parseFloat(translateValues[0]) + x;
                    y = parseFloat(translateValues[1]) + y;
                    style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
                } else if (unitMatch[0] === "%") {
                    // % unit, so calculate the percentage of the element's width and height.
                    const width = target.offsetWidth;
                    const height = target.offsetHeight;
                    x = parseFloat(translateValues[0]) / 100 * width + x;
                    y = parseFloat(translateValues[1]) / 100 * height + y;
                    style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
                } else if (unitMatch[0] === "em") {
                    // em unit, so calculate the percentage of the element's font size.
                    const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
                    x = parseFloat(translateValues[0]) * fontSize + x;
                    y = parseFloat(translateValues[1]) * fontSize + y;
                    style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
                } else {
                    // Unknown unit.
                    style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
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
            const translateValues = translateMatch ? translateMatch[1].split(",") : ['0px', '0px'];
            // Determine the unit of the translation values.
            const unitRegex = /[a-zA-Z%]+/;
            const unitMatch = translateValues[0].match(unitRegex);
            if (!unitMatch) {
                // Invalid CSS unit, so ignore the original value.
                style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
            } else if (unitMatch[0] === "px") {
                // px unit, so we can safely add the values.
                x = parseFloat(translateValues[0]) + x;
                y = parseFloat(translateValues[1]) + y;
                style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
            } else if (unitMatch[0] === "%") {
                // % unit, so we need to calculate the percentage of the element's width and height.
                const width = target.offsetWidth;
                const height = target.offsetHeight;
                x = parseFloat(translateValues[0]) / 100 * width + x;
                y = parseFloat(translateValues[1]) / 100 * height + y;
                style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
            } else if (unitMatch[0] === "em") {
                // em unit, so we need to calculate the percentage of the element's font size.
                const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
                x = parseFloat(translateValues[0]) * fontSize + x;
                y = parseFloat(translateValues[1]) * fontSize + y;
                style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
            } else {
                // Unknown unit, so we can't do anything.
                style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`);
            }
        }
    } else if (originalTransform.indexOf("translate") === -1) {
        // Put the translation at the beginning.
        style = `translate(${x}px, ${y}px) ` + originalTransfor
    } else {
        // Pre-existing positioning transform.
        // Get the original translation values.
        const translateRegex = /\btranslate\(([^)]+)\)/;
        const translateMatch = originalTransform.match(translateRegex);
        const translateValues = translateMatch ? translateMatch[1].split(",") : ['0px', '0px'];
        // Determine the unit of the translation values.
        const unitRegex = /[a-zA-Z%]+/;
        const unitMatch = translateValues[0].match(unitRegex);
        if (!unitMatch) {
            // Invalid CSS unit, so ignore the original value.
            style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`)
        } else if (unitMatch[0] === "px") {
            // px unit, so we can safely add the values.
            x = parseFloat(translateValues[0]) + x;
            y = parseFloat(translateValues[1]) + y;
            style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`)
        } else if (unitMatch[0] === "%") {
            // % unit, so we need to calculate the percentage of the element's width and height.
            const width = target.offsetWidth;
            const height = target.offsetHeight;
            x = parseFloat(translateValues[0]) / 100 * width + x;
            y = parseFloat(translateValues[1]) / 100 * height + y;
            style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`)
        } else if (unitMatch[0] === "em") {
            // em unit, so we need to calculate the percentage of the element's font size.
            const fontSize = parseFloat(window.getComputedStyle(target).fontSize);
            x = parseFloat(translateValues[0]) * fontSize + x;
            y = parseFloat(translateValues[1]) * fontSize + y;
            style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`)
        } else {
            // Unknown unit, so we can't do anything.
            style = originalTransform.replace(/translate\(([^)]+)\)/, `translate(${x}px, ${y}px)`)
        }
    }
    return {
        x,
        y,
        style,
    };
}

export default main;
