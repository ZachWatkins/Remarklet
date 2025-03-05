// Import the required functions
import { setMode, state } from './global.js';
(function () {

    console.log('Content script loaded');
    setMode("dragging");

    // Include the content of index.js directly
    function activate() {
        setMode("dragging");
    }
    function deactivate() {
        setMode("");
    }

    chrome.runtime.onMessage.addListener(function (message) {
        console.log('Content script received message:', message);
        setMode("dragging");

        if (message.type === 'setExtensionStatus') {
            if (message.status) {
                console.log('Activating extension', state);
                activate();
            } else {
                console.log('Deactivating extension');
                deactivate();
            }
        }
    });
    activate();
})();
