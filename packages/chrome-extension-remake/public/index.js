// @ts-check
import { activate, deactivate } from "../src/index.js";

const init = async function () {
    let active = true;
    const toggleButton = document.querySelector('#btn_active');
    if (!toggleButton) {
        throw new Error("Toggle button not found");
    }
    const setActive = (enabled) => {
        active = Boolean(enabled);
        if (enabled) {
            toggleButton.classList.add('enabled');
            toggleButton.innerHTML = "On";
        } else {
            toggleButton.classList.remove('enabled');
            toggleButton.innerHTML = "Off";
        }
    };

    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(!active);
        // @ts-ignore
        if (chrome) {
            // @ts-ignore
            chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            }).then(([tab]) => tab.url
                // @ts-ignore
                && chrome.runtime.sendMessage({
                    type: 'setExtensionEnabled',
                    host: new URL(tab.url).host,
                    status: !active,
                })
            );
        }
    });

    // @ts-ignore
    if (chrome) {
        // @ts-ignore
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        }).then(([tab]) => tab.url
            // @ts-ignore
            && chrome.runtime.sendMessage({
                type: 'getExtensionStatus',
                host: new URL(tab.url).host,
            }).then((response) => setActive(response.status))
        )
    }
};

document.addEventListener('DOMContentLoaded', init);
