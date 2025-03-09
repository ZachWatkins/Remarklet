import store from "./store.js";
import drag from "./drag.js";
import target from "./target.js";
import styles from "./styles.js";
import textedit from "./textedit.js";
styles();
drag();
target();
textedit();

chrome.runtime.onMessage.addListener(function (message) {
    console.log('Content script received message:', message);
    if (message.type === 'setExtensionStatus') {
        if (message.value) {
            console.log('Activating extension');
            store.set('active', true);
        } else {
            console.log('Deactivating extension');
            store.set('active', false);
        }
    }
});

chrome.storage.sync.get("status", (result) => {
    if (result.status === true) {
        store.set('active', true);
    }
});
