// import menu from './menu.js';
const state = {
    on: false,
    showGrid: false,
    showOutline: false,
};
window['on-button'].addEventListener('click', function () {
    if (!state.on) {
        window['on-button'].classList.remove('off');
        window['off-button'].classList.add('off');
        state.on = true;
    }
    // Send message to the content script.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'on' });
    });
});
window['off-button'].addEventListener('click', function () {
    if (state.on) {
        window['on-button'].classList.add('off');
        window['off-button'].classList.remove('off');
        state.on = false;
    }
    // Send message to the content script.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'off' });
    });
});
window.export.addEventListener('click', function () {
    console.log('export');
});
window.save.addEventListener('click', function () {
    console.log('save');
});
window.reset.addEventListener('click', function () {
    console.log('reset');
});
window['show-outline'].addEventListener('click', function () {
    if (!state.showOutline) {
        window['show-outline'].classList.add('hidden');
        window['hide-outline'].classList.remove('hidden');
        state.showOutline = true;
    }
});
window['hide-outline'].addEventListener('click', function () {
    if (state.showOutline) {
        window['show-outline'].classList.remove('hidden');
        window['hide-outline'].classList.add('hidden');
        state.showOutline = false;
    }
});
window['show-grid'].addEventListener('click', function () {
    if (!state.showGrid) {
        window['show-grid'].classList.add('hidden');
        window['hide-grid'].classList.remove('hidden');
        state.showGrid = true;
    }
});
window['hide-grid'].addEventListener('click', function () {
    if (state.showGrid) {
        window['show-grid'].classList.remove('hidden');
        window['hide-grid'].classList.add('hidden');
        state.showGrid = false;
    }
});
window['show-styles'].addEventListener('click', function () {
    if (!state.showStyles) {
        window['show-styles'].classList.add('hidden');
        window['hide-styles'].classList.remove('hidden');
        state.showStyles = true;
    }
});
window['hide-styles'].addEventListener('click', function () {
    if (state.showStyles) {
        window['show-styles'].classList.remove('hidden');
        window['hide-styles'].classList.add('hidden');
        state.showStyles = false;
    }
});
window['add-image'].addEventListener('click', function () {
    console.log('add-image');
});
window['add-note'].addEventListener('click', function () {
    console.log('add-note');
});
window['add-code'].addEventListener('click', function () {
    console.log('add-code');
});
window['show-help'].addEventListener('click', function () {
    console.log('show-help');
});
