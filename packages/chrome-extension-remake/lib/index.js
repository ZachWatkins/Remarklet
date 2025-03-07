import { setMode } from "./store.js";

chrome.runtime.onMessage.addListener(function (message) {
    console.log('Content script received message:', message);
    if (message.type === 'setExtensionStatus') {
        if (message.value) {
            console.log('Activating extension');
            setMode('dragging');
        } else {
            console.log('Deactivating extension');
            setMode('idle');
        }
    }
});
