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

function activate() {
    document.body.addEventListener('mousemove', logMouseMove);
}
function deactivate() {
    document.body.removeEventListener('mousemove', logMouseMove);
}

function logMouseMove(e) {
    chrome.runtime.sendMessage({
        type: 'log',
        name: 'mousemove',
        options: { x: e.clientX, y: e.clientY },
    });
}
