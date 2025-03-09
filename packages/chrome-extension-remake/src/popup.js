// @ts-check
/** @type {HTMLInputElement} */
const toggle = document.querySelector('#enabled') || document.createElement('input');

toggle.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement) {
        const value = e.target.checked;
        console.log('setting extension status', 'popup.js');
        chrome.runtime.sendMessage({
            type: 'remarkletSetExtensionStatus',
            value,
        });
    }
});

const privacyUrl = chrome.runtime.getURL('privacy.html');
const privacyLink = document.querySelector('#privacy');
if (privacyLink instanceof HTMLAnchorElement) {
    privacyLink.href = privacyUrl;
}

chrome.runtime.sendMessage({
    type: 'remarkletGetExtensionStatus',
}).then((response) => {
    toggle.checked = response.value;
});
