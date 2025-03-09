const state = {
    loadedJquery: false,
};
console.log('loaded');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'on') {
        if (request.value === true) {
            if (!state.loadedJquery) {
                state.loadedJquery = true;
                (async () => {
                    const src = chrome.runtime.getURL(
                        'jquery-ui-1.13.2.custom/external/jquery/jquery.js',
                    );
                    const contentMain = await import(src);
                    contentMain.main();
                    const srcUI = chrome.runtime.getURL(
                        'jquery-ui-1.13.2.custom/jquery-ui.js',
                    );
                    const contentUI = await import(srcUI);
                    contentUI.main();
                    $('*').draggable();
                    $('*').resizable();
                })();
            } else {
                $('*').draggable();
                $('*').resizable();
            }
        } else {
            $('*').draggable('destroy');
            $('*').resizable('destroy');
        }
    }
});
