import interact from "interactjs";
import store from "./store.js";

let interactable = null;

store.subscribe('active', (active) => {
    if (active) {
        if (interactable) {
            return;
        }
        interactable = interact('*')
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                autoScroll: true,
                listeners: {
                    move: dragMoveListener,
                    end(event) {
                        store.set('dragging', false);
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

function dragMoveListener(event) {
    store.set('dragging', true);
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

export default {
    activate,
    deactivate,
    dragMoveListener,
};
