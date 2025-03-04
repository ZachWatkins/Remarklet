// import { activate, deactivate } from '../src/index.js';

chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === 'setExtensionStatus') {
        if (message.status) {
            console.log('activate();');
        } else {
            console.log('deactivate();');
        }
    }
});
