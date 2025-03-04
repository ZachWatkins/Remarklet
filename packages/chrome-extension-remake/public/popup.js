// @ts-check
/** @type {HTMLInputElement} */
const toggle = document.querySelector('#enabled') || document.createElement('input');

toggle.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement) {
        const value = e.target.checked;
        console.log('setting extension status', 'popup.js');
        chrome.runtime.sendMessage({
            type: 'setExtensionStatus',
            value,
        });
    }
});

chrome.runtime.sendMessage({
    type: 'getExtensionStatus',
}).then((response) => {
    console.log('popup.js', new Date().toISOString(), response.value);
    toggle.checked = response.value;
});
