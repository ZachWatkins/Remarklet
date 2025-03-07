import("./store.js").then(({ default: store }) => {

    chrome.runtime.onMessage.addListener(function (message) {
        console.log('Content script received message:', message);
        if (message.type === 'setExtensionStatus') {
            if (message.value) {
                console.log('Activating extension');
                store.set('active', true);
            } else {
                console.log('Deactivating extension');
                store.set('active', false);
            }
        }
    });

    store.set('active', true);
});
