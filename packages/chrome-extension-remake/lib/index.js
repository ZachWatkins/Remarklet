import { setMode } from "./global.js";
import * as interact from "interactjs";

interact('*').draggable({
    listeners: {
        start(event) {
            console.log('start', event);
        },
        move(event) {
            console.log('move', event);
        },
        end(event) {
            console.log('end', event);
        }
    }
});

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
