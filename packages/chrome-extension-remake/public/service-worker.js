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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') init(tab);
});

chrome.tabs.onActivated.addListener((info) => {
    chrome.tabs.get(info.tabId, init);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'getExtensionStatus') {
        getExtensionStatus(request.tab).then((status) => {
            sendResponse({ status });
        });
    } else if (request.type === 'setExtensionStatus') {
        chrome.storage.sync.set({ [request.host || request.url]: request.status }, () => { });
        const icon = request.status ? icons.enabled : icons.disabled;
        chrome.action.setIcon({ path: icon });
        sendResponse({ status: request.status });
    }
});

/**
 * Initialize the extension icon based on the current tab.
 * @param {chrome.tabs.Tab} tab The current tab.
 * @returns {void}
 */
async function init(tab) {
    const status = await getExtensionStatus(tab);
    const icon = status ? icons.enabled : icons.disabled;
    chrome.action.setIcon({ path: icon });
}

function getExtensionStatus(tab) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(tab.host || tab.url, (result) => {
            resolve(result[tab.host || tab.url] || true);
        });
    });
}
