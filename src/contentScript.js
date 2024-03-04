// contentScript.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addHTML') {
        // Add your HTML here
        document.body.innerHTML += '<p>Hello, World!</p>';
    }
});
