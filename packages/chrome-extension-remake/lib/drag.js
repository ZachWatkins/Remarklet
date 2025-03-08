import interact from "interactjs";
import store from "./store.js";
import { highlightClass } from "./highlight.js";

let interactable = null;
let inlineTarget = null;

export function main() {
    store.subscribe('active', (active) => {
        if (active) {
            if (interactable) {
                return;
            }
            console.log('making it interactable');
            interactable = interact('*')
                .draggable({
                    autoScroll: true,
                    listeners: {
                        start,
                        move,
                        end,
                    }
                });
        } else {
            if (!interactable) {
                return;
            }
            interactable.unset();
            interactable = null;
        }
    });
}

/**
 * Handles the drag start event
 * @param {DragEvent} event The drag start event
 * @param {HTMLElement} event.target The target element being dragged
 * @return {void}
 */
function start(event) {
    store.set('dragging', true);
    // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
    if (window.getComputedStyle(event.target).display === 'inline') {
        let parent = event.target.parentElement;
        while (parent && window.getComputedStyle(parent).display === 'inline') {
            parent = parent.parentElement;
        }
        if (parent) {
            store.get('target').classList.remove(highlightClass);
            parent.classList.add(highlightClass);
            store.set('target', parent);
            inlineTarget = event.target;
        }
    } else {
        store.set('target', event.target);
    }
}

/**
 * Handles the drag move event
 * @param {DragEvent} event The drag move event
 * @param {HTMLElement} event.target The target element being dragged
 * @return {void}
 */
function move(event) {
    var target = store.get('target');
    if (!target) {
        return;
    }
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

/**
 * Handles the drag end event
 * @param {DragEvent} event The drag end event
 * @param {HTMLElement} event.target The target element being dragged
 * @return {void}
 */
function end(event) {
    store.set('dragging', false);
    if (inlineTarget) {
        store.get('target').classList.remove(highlightClass);
        inlineTarget.classList.add(highlightClass);
        store.set('target', inlineTarget);
        inlineTarget = null;
    }
}

export default main;
