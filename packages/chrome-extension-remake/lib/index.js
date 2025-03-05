import { setMode } from "./global.js";
import * as interact from "interactjs";

// target elements with the "draggable" class
let interactable = null;
function activate() {
    if (interactable) {
        return;
    }
    interactable = interact('*')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            // enable autoScroll
            autoScroll: true,

            listeners: {
                // call this function on every dragmove event
                move: dragMoveListener,

                // call this function on every dragend event
                end(event) {
                    setMode("idle");
                }
            }
        });
}

function deactivate() {
    if (!interactable) {
        return;
    }
    interactable.unset();
    interactable = null;
}

function dragMoveListener(event) {
    setMode("dragging");
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

chrome.runtime.onMessage.addListener(function (message) {
    console.log('Content script received message:', message);
    // setMode("dragging");

    if (message.type === 'setExtensionStatus') {
        if (message.value) {
            console.log('Activating extension', state);
            activate();
        } else {
            console.log('Deactivating extension');
            deactivate();
        }
    }
});
