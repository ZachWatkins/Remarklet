const icons = {
    enabled: {
        '16': 'icon-16.png',
        '32': 'icon-32.png',
        '48': 'icon-48.png',
        '128': 'icon-128.png',
    },
    disabled: {
        '16': 'icon-16-off.png',
        '32': 'icon-32-off.png',
        '48': 'icon-48-off.png',
        '128': 'icon-128-off.png',
    },
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') init();
});

chrome.tabs.onActivated.addListener((info) => {
    init();
});

chrome.runtime.onMessage.addListener(handleMessage);

function init() {
    chrome.storage.sync.get("status", (result) => {
        const status = result.status;
        const icon = status ? icons.enabled : icons.disabled;
        chrome.action.setIcon({ path: icon });
    });
}

function handleMessage(message, sender, sendResponse) {
    console.log(message);
    if (message.type === 'getExtensionStatus') {
        chrome.storage.sync.get("status", (result) => {
            sendResponse({ value: result.status });
        });
        return true;
    } else if (message.type === 'setExtensionStatus') {
        chrome.action.setIcon({
            path: message.value ? icons.enabled : icons.disabled,
        }).then(() => {
            chrome.storage.sync.set({
                status: message.value,
            }, () => {
                sendResponse({ value: message.value });

                // Forward message to active tab's content script
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0] && tabs[0].id) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'setExtensionStatus',
                            status: message.value  // Match the property name expected by content script
                        });
                    }
                });
            });
        });
        return true;
    }
}
