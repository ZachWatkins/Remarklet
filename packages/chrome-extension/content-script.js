chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message) {
        case 'on':
            activate();
            sendResponse({ message: 'activated' });
            break;
        default:
            deactivate();
            sendResponse({ message: 'deactivated' });
            break;
    }
});

function activate() {
    document.body.addEventListener('mousemove', logMouseMove);
}
function deactivate() {
    document.body.removeEventListener('mousemove', logMouseMove);
}

function logMouseMove(e) {
    chrome.runtime.sendMessage({
        name: 'mousemove',
        options: { x: e.clientX, y: e.clientY },
    });
}
