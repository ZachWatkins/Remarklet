const STATE = {
    on: false,
    showGrid: false,
    showOutline: false,
};

function setState(key, value) {
    Object.assign(STATE, { [key]: value });
    chrome.storage.local.set({ [key]: value });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: key,
            value,
        });
    });
}

const DYNAMIC_SCRIPT_ID = 'dynamic-script';

async function isDynamicContentScriptRegistered() {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    return scripts.some((s) => s.id === DYNAMIC_SCRIPT_ID);
}

// Register content scripts.
chrome.scripting.registerContentScripts([
    {
        id: DYNAMIC_SCRIPT_ID,
        js: ['content-script.js'],
        persistAcrossSessions: true,
        matches: ['<all_urls>'],
        runAt: 'document_idle',
        allFrames: false,
        world: 'ISOLATED',
    },
]);

document.getElementById('btn_on').addEventListener('click', async function () {
    if (!STATE['on']) {
        document.getElementById('btn_on').classList.remove('off');
        document.getElementById('btn_off').classList.add('off');
        setState('on', true);
        // Unregister the dynamic content script to avoid multiple injections.
        const dynamicContentScriptRegistered =
            await isDynamicContentScriptRegistered();

        if (dynamicContentScriptRegistered) {
            await chrome.scripting.unregisterContentScripts({
                ids: [DYNAMIC_SCRIPT_ID],
            });
        }

        // Now, execute the script. We handle this in the service worker so we can
        // wait for the tab to open and **then** inject our script.
        chrome.runtime.sendMessage({
            name: 'inject-programmatic',
            options: { world: 'ISOLATED' },
        });
    }
});
document.getElementById('btn_off').addEventListener('click', function () {
    if (STATE['on']) {
        document.getElementById('btn_on').classList.add('off');
        document.getElementById('btn_off').classList.remove('off');
        setState('on', false);
    }
});
document.getElementById('btn_export').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
document.getElementById('btn_save').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
document.getElementById('btn_reset').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
document
    .getElementById('btn_show_outline')
    .addEventListener('click', function () {
        if (!STATE['showOutline']) {
            document.getElementById('btn_show_outline').classList.add('hidden');
            document
                .getElementById('btn_hide_outline')
                .classList.remove('hidden');
            setState('showOutline', true);
        }
    });
document
    .getElementById('btn_hide_outline')
    .addEventListener('click', function () {
        if (STATE['showOutline']) {
            document
                .getElementById('btn_show_outline')
                .classList.remove('hidden');
            document.getElementById('btn_hide_outline').classList.add('hidden');
            setState('showOutline', false);
        }
    });
document.getElementById('btn_show_grid').addEventListener('click', function () {
    if (!STATE['showGrid']) {
        document.getElementById('btn_show_grid').classList.add('hidden');
        document.getElementById('btn_hide_grid').classList.remove('hidden');
        setState('showGrid', true);
    }
});
document.getElementById('btn_hide_grid').addEventListener('click', function () {
    if (STATE['showGrid']) {
        document.getElementById('btn_show_grid').classList.remove('hidden');
        document.getElementById('btn_hide_grid').classList.add('hidden');
        setState('showGrid', false);
    }
});
document
    .getElementById('btn_show_styles')
    .addEventListener('click', function () {
        if (!STATE['showStyles']) {
            document.getElementById('btn_show_styles').classList.add('hidden');
            document
                .getElementById('btn_hide_styles')
                .classList.remove('hidden');
            setState('showStyles', true);
        }
    });
document
    .getElementById('btn_hide_styles')
    .addEventListener('click', function () {
        if (STATE['showStyles']) {
            document
                .getElementById('btn_show_styles')
                .classList.remove('hidden');
            document.getElementById('btn_hide_styles').classList.add('hidden');
            setState('showStyles', false);
        }
    });
document.getElementById('btn_add_image').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
document.getElementById('btn_add_note').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
document.getElementById('btn_add_code').addEventListener('click', function () {
    document.getElementById('alert')('not implemented');
});
