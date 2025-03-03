// @ts-check
let active = true;
const toggleButton = document.querySelector('#btn_active') || document.createElement('button');
const setActive = (enabled) => {
    active = Boolean(enabled);
    if (enabled) {
        toggleButton.classList.add('on');
        toggleButton.innerHTML = "On";
    } else {
        toggleButton.classList.remove('on');
        toggleButton.innerHTML = "Off";
    }
};

toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    const status = !active;
    setActive(status);
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    }).then(([tab]) => {
        chrome.runtime.sendMessage({
            type: 'setExtensionStatus',
            tab,
            status,
        });
    });
});

chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
}).then(([tab]) => {
    chrome.runtime.sendMessage({
        type: 'getExtensionStatus',
        tab,
    }).then((response) => {
        setActive(response.status);
    });
});
