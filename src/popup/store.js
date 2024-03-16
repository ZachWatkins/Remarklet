const state = {
    ON: false,
    showGrid: false,
    showOutline: false,
};

export function setState(key, value) {
    const newValue = { [key]: value };
    Object.assign(state, newValue);
    chrome.storage.local.set(newValue);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: key, value });
    });
}

export function getState(key) {
    return state[key];
}
