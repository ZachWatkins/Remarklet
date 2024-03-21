const state = {
    loadedJquery: false,
};
console.log('loaded');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'on') {
        if (request.value === true) {
            if (!state.loadedJquery) {
                state.loadedJquery = true;
                import(
                    './jquery-ui-1.13.2.custom/external/jquery/jquery.js'
                ).then((moduleJquery) => {
                    console.log('jQuery loaded', moduleJquery);
                    import('./jquery-ui-1.13.2.custom/jquery-ui.js').then(
                        (moduleJqueryUI) => {
                            console.log('jQuery UI loaded', moduleJqueryUI);
                            $('*').draggable();
                            $('*').resizable();
                        },
                    );
                });
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
