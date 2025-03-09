import interact from "interactjs";
import store from "./store.js";

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
                        start: dragStart,
                        move: dragMove,
                        end: dragEnd,
                    }
                })
                .resizable({
                    edges: { left: true, right: true, bottom: true, top: false },
                    listeners: {
                        start(event) {
                            // An inline element cannot be resized.
                            store.set('mode', 'resizing');
                        },
                        move(event) {
                            const target = event.target;
                            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
                            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;

                            target.style.width = event.rect.width + 'px';
                            target.style.height = event.rect.height + 'px';
                            target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        },
                        end(event) {
                            store.set('mode', 'idle');
                        }
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
function dragStart(event) {
    if (store.get('modifying')) {
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    store.set('mode', 'dragging');
    // If the element has a computed display:inline property, it cannot be dragged, so we change the target to the first parent that is not display:inline.
    if (window.getComputedStyle(event.target).display === 'inline') {
        let parent = event.target.parentElement;
        while (parent && window.getComputedStyle(parent).display === 'inline') {
            parent = parent.parentElement;
        }
        if (parent) {
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
function dragMove(event) {
    var target = store.get('target');
    if (!target || target !== event.target) {
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
function dragEnd(event) {
    event.stopPropagation();
    event.preventDefault();
    const target = store.get('target');
    if (!target) {
        return;
    }
    if (event.target === inlineTarget) {
        store.set('target', inlineTarget);
        inlineTarget = null;
        store.set('mode', 'idle');
        return;
    }
    if (event.target !== target) {
        return;
    }
    store.set('mode', 'idle');
}

export default main;
