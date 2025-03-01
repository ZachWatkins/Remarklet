import { activate, deactivate } from '../src/index.js';

chrome.runtime.onMessage.addListener(function (message) {
    switch (message) {
        case 'activate':
            activate();
            break;
        default:
            deactivate();
            break;
    }
});
