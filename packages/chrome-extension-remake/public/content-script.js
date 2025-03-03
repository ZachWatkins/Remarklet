import { activate, deactivate } from '../src/index.js';

chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === 'setExtensionStatus') {
        if (message.status) {
            activate();
        } else {
            deactivate();
        }
    }
});
