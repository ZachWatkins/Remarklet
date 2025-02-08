import { activate, deactivate } from './content-script-base.js';

chrome.runtime.onMessage.addListener(function (message) {
    switch (message) {
        case 'on':
            activate();
            break;
        default:
            deactivate();
            break;
    }
});

function logMouseMove(e) {
    chrome.runtime.sendMessage({
        type: 'log',
        name: 'mousemove',
        options: { x: e.clientX, y: e.clientY },
    });
}
