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

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.action.setIcon({ path: icons.enabled });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') init(tab);
});

chrome.tabs.onActivated.addListener((info) => {
    chrome.tabs.get(info.tabId, init);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'getExtensionStatus') {
        getExtensionStatus(request.host).then((status) => {
            sendResponse({ status });
        });
        return true;
    } else if (request.type === 'setExtensionStatus') {
        setExtensionStatus(request.host, request.status);
        const icon = request.status ? icons.enabled : icons.disabled;
        chrome.action.setIcon({ path: icon });
    } else if (request.type === 'log') {
        console.log(JSON.stringify(request));
    }
});

/**
 * Initialize the extension icon based on the current tab.
 * @param {chrome.tabs.Tab} tab The current tab.
 * @returns {void}
 */
async function init(tab) {
    if (!tab.url) {
        chrome.action.setIcon({ path: icons.disabled });
        return;
    }
    const url = new URL(tab.url);
    if (url.protocol !== 'chrome-extension:') {
        const host = url.host;
        const status = await getExtensionStatus(host);
        const icon = status ? icons.enabled : icons.disabled;
        chrome.action.setIcon({ path: icon });
    } else {
        chrome.action.setIcon({ path: icons.disabled });
    }
}

/**
 * Get the extension status for the given host.
 * @param {string} host The host to get the extension status for.
 * @returns {Promise<boolean>} The extension status for the given host.
 */
function getExtensionStatus(host) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(host, (result) => {
            if (result[host] !== undefined) {
                resolve(result[host]);
            } else {
                setExtensionStatus(host, true);
            }
        });
    });
}

/**
 * Set the extension status for the given host.
 * @param {string} host The host to set the extension status for.
 * @param {boolean} toggleBtnStatus The extension status to set.
 * @returns {void}
 */
function setExtensionStatus(host, toggleBtnStatus) {
    const data = { [host]: toggleBtnStatus };
    chrome.storage.sync.set(data, () => {});
}
