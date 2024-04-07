const DYNAMIC_SCRIPT_ID = 'dynamic-script';

const getState = async function (key) {
    return (await chrome.storage.local.get(key))[key];
};

const setState = async function (key, value) {
    return chrome.storage.local.set({ [key]: value });
};

const send = async function (s) {
    return chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => chrome.tabs.sendMessage(tabs[0].id, s))
        .catch(console.error);
};

const registerEvents = function () {
    document.getElementById('btn_on').addEventListener('click', function () {
        getState('on').then((isOn) => {
            if (isOn) {
                return;
            }
            send('on').then(() => {
                document.getElementById('btn_on').classList.add('on');
                document.getElementById('btn_off').classList.remove('on');
                setState('on', true);
            });
        });
    });

    document.getElementById('btn_off').addEventListener('click', function () {
        getState('on').then((isOn) => {
            if (!isOn) {
                return;
            }
            send('off').then(() => {
                document.getElementById('btn_off').classList.add('on');
                document.getElementById('btn_on').classList.remove('on');
                setState('on', false);
            });
        });
    });
    document
        .getElementById('btn_export')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_save')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_reset')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_show_outline')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_hide_outline')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_show_grid')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_hide_grid')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_show_styles')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_hide_styles')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_add_image')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_add_note')
        .addEventListener('click', function () {});
    document
        .getElementById('btn_add_code')
        .addEventListener('click', function () {});
};

const init = async function () {
    const isOn = await getState('on');

    if (isOn) {
        document.getElementById('btn_on').classList.add('on');
    } else {
        document.getElementById('btn_off').classList.add('on');
    }

    registerEvents();
};

init();
