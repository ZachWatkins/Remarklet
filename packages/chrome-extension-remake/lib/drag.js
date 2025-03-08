import interact from "interactjs";
import store from "./store.js";

let interactable = null;

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
                        start(event) {
                            store.set('dragging', true);
                        },
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
        var target = event.target;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
}

export default main;
