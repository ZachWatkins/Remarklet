import interact from "interactjs";
import store from "./store.js";

let interactable = null;
let inlineTarget = null;

export function main() {
    store.subscribe('target', (target) => {
        if (!store.get('active')) {
            if (interactable) {
                interactable.unset();
                interactable = null;
            }
            return;
        }
        if (target && window.getComputedStyle(target).display !== 'inline') {
            if (interactable) {
                interactable.unset();
                interactable = null;
            }
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
            if (store.get('modifying')) {
                console.log('modifying');
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
        },
        /**
         * Handles the drag move event
         * @param {DragEvent} event The drag move event
         * @param {HTMLElement} event.target The target element being dragged
         * @return {void}
         */
        move(event) {
            var target = store.get('target');
            if (!target || target !== event.target) {
                return;
            }
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
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
        },
    },
}

const resizableOptions = {
    edges: { left: true, right: true, bottom: true, top: false },
    listeners: {
        start(event) {
            // An inline element cannot be resized. I can't decide the least surprising behavior here.
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
};

export default main;
