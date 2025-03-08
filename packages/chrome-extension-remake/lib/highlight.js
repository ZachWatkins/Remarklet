/**
 * @module highlight
 * @description Adds mouseenter/mouseleave event handlers that add outline styles when hovering over elements and removes them when leaving elements.
*/
import store from "./store.js";

const highlightClass = 'remarklet-highlight';

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
}

/**
 * Handles the mouseenter event
 * @param {MouseEvent} event The mouseenter event
 */
function handleMouseEnter(event) {
    event.stopPropagation();
    const element = event.target;
    if (store.get('target')) {
        store.get('target').classList.remove(highlightClass);
    }
    if (element.classList) {
        store.set('target', element);
        element.classList.add(highlightClass);
    }
}

/**
 * Handles the mouseleave event
 * @param {MouseEvent} event The mouseleave event
 */
function handleMouseLeave(event) {
    event.stopPropagation();
    const element = event.target;
    if (element.classList) {
        store.set('target', null);
        element.classList.remove(highlightClass);
    }
}
