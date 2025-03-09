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
    if (message.type === 'remarkletSetExtensionStatus') {
        if (message.value) {
            store.set('active', true);
        } else {
            store.set('active', false);
        }
    }
});

chrome.storage.sync.get("status", (result) => {
    if (result.status === true) {
        store.set('active', true);
    }
});
