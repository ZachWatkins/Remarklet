import store from "./store.js";

/**
 * Element highlighting indicator module
 * Adds mouseenter/mouseleave event handlers that add outline styles when hovering
 * over elements and removes them when leaving elements
 */

// Map to store the original outline styles of elements
const originalOutlines = new WeakMap();
const outlineStyle = '2px solid #00b3dd';

/**
 * Adds mouse event handlers to all elements in the document
 */
export function main() {
    store.subscribe('active', (active) => {
        if (active) {
            document.addEventListener('mouseenter', handleMouseEnter, true);
            document.addEventListener('mouseleave', handleMouseLeave, true);
        } else {
            document.removeEventListener('mouseenter', handleMouseEnter, true);
            document.removeEventListener('mouseleave', handleMouseLeave, true);
        }
    });
}

/**
 * Handles the mouseenter event
 * @param {MouseEvent} event The mouseenter event
 */
function handleMouseEnter(event) {
    const element = event.target;
    store.set('target', element);

    // Skip body and html elements.
    if (element === document.body || element === document.documentElement) {
        return;
    }

    // Store the original outline if we haven't already.
    console.log('element', element);
    if (!originalOutlines.has(element) && (element.style.outline || element.style.outlineOffset || element.style.outlineStyle || element.style.outlineWidth || element.style.outlineColor)) {
        const original = {
            outline: element.style.outline,
            outlineOffset: element.style.outlineOffset,
            outlineStyle: element.style.outlineStyle,
            outlineWidth: element.style.outlineWidth,
            outlineColor: element.style.outlineColor
        };
        originalOutlines.set(element, original);
    }

    // Apply the highlighting outline.
    if (element.style.outline !== outlineStyle) {
        element.style.outline = outlineStyle;
    }
    if (element.style.outlineOffset !== '-1px') {
        element.style.outlineOffset = '-1px';
    }
    if (element.style.outlineStyle) {
        element.style.outlineStyle = '';
    }
    if (element.style.outlineWidth) {
        element.style.outlineWidth = '';
    }
    if (element.style.outlineColor) {
        element.style.outlineColor = '';
    }
}

/**
 * Handles the mouseleave event
 * @param {MouseEvent} event The mouseleave event
 */
function handleMouseLeave(event) {
    const element = event.target;

    // Skip body and html elements.
    if (element === document.body || element === document.documentElement) {
        return;
    }

    // Restore original outline style if we have it stored.
    if (originalOutlines.has(element)) {
        const original = originalOutlines.get(element);
        for (let i = 0; i < outlineStyleNames.length; i++) {
            const name = outlineStyleNames[i];
            if (original[name]) {
                element.style[name] = original[name];
            } else if (name === 'outline' && element.style[name]) {
                element.style[name] = '';
            } else if (name === 'outlineOffset' && element.style[name]) {
                element.style[name] = '';
            }
        }
    } else {
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.outlineStyle = '';
        element.style.outlineWidth = '';
        element.style.outlineColor = '';
    }
}
