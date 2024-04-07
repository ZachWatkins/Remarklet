const init = async function () {
    const toggleBtnOn = document.querySelector('#btn_on');
    const toggleBtnOff = document.querySelector('#btn_off');
    toggleBtnOff.classList.add('on');

    toggleBtnOn.addEventListener('mousedown', (e) => {
        toggleBtnOn.classList.add('active');
    });

    toggleBtnOn.addEventListener('mouseup', (e) => {
        toggleBtnOn.classList.remove('active');
    });

    toggleBtnOff.addEventListener('mousedown', (e) => {
        toggleBtnOff.classList.add('active');
    });

    toggleBtnOff.addEventListener('mouseup', (e) => {
        toggleBtnOff.classList.remove('active');
    });

    toggleBtnOn.addEventListener('click', async (e) => {
        e.preventDefault();
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
                toggleBtnOff.classList.remove('on');
            });
    });

    toggleBtnOff.addEventListener('click', async (e) => {
        e.preventDefault();
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
