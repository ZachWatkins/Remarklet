const init = async function () {
    const toggleBtnOn = document.querySelector('#btn_on');
    const toggleBtnOff = document.querySelector('#btn_off');
    toggleBtnOff.classList.add('on');

    toggleBtnOn.addEventListener('click', async () => {
        toggleBtnOn.classList.add('running');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        if (!tab.url) {
            return;
        }
        const host = new URL(tab.url).host;
        chrome.runtime
            .sendMessage({
                type: 'setExtensionStatus',
                host,
                status: true,
            })
            .then(() => {
                toggleBtnOn.classList.add('on');
                toggleBtnOn.classList.remove('running');
                toggleBtnOff.classList.remove('on');
            });
    });

    toggleBtnOff.addEventListener('click', async () => {
        toggleBtnOff.classList.add('running');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        if (!tab.url) {
            return;
        }
        const host = new URL(tab.url).host;
        chrome.runtime
            .sendMessage({
                type: 'setExtensionStatus',
                host,
                status: false,
            })
            .then(() => {
                toggleBtnOn.classList.remove('on');
                toggleBtnOff.classList.add('on');
                toggleBtnOff.classList.remove('running');
            });
    });

    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    if (!tab.url) {
        return;
    }

    const message = {
        type: 'getExtensionStatus',
        host: new URL(tab.url).host,
    };

    chrome.runtime.sendMessage(message).then((response) => {
        if (response.status) {
            toggleBtnOn.classList.add('on');
            toggleBtnOff.classList.remove('on');
        } else {
            toggleBtnOn.classList.remove('on');
            toggleBtnOff.classList.add('on');
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
