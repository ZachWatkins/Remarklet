/**
 * @module highlight
 * @description Adds mouseenter/mouseleave event handlers that add outline styles when hovering over elements and removes them when leaving elements.
*/
import store from "./store.js";

export const highlightClass = 'remarklet-highlight';

const mouseEnterStack = [];

/**
 * Adds mouse event handlers to all elements in the document
 */
export default function main() {
    store.subscribe('active', (active) => {
        if (active) {
            document.addEventListener('mouseenter', handleMouseEnter, true);
            document.addEventListener('mouseleave', handleMouseLeave, true);
        } else {
            document.removeEventListener('mouseenter', handleMouseEnter, true);
            document.removeEventListener('mouseleave', handleMouseLeave, true);
        }
    });
    store.subscribe('target', (target, oldTarget) => {
        target?.classList.add(highlightClass);
        oldTarget?.classList.remove(highlightClass);
    });
}

/**
 * Handles the mouseenter event
 * @param {MouseEvent} event The mouseenter event
 */
function handleMouseEnter(event) {
    event.stopPropagation();
    if (event.target.classList && !store.get('modifying')) {
        mouseEnterStack.push(event.target);
        store.set('target', event.target);
    }
}

/**
 * Handles the mouseleave event
 * @param {MouseEvent} event The mouseleave event
 */
function handleMouseLeave(event) {
    event.stopPropagation();
    if (event.target.classList && !store.get('modifying')) {
        const index = mouseEnterStack.indexOf(event.target);
        if (index !== -1) {
            mouseEnterStack.splice(index, 1);
            if (mouseEnterStack.length === 0) {
                store.set('target', null);
            } else {
                store.set('target', mouseEnterStack[mouseEnterStack.length - 1]);
            }
        }
    }
}
