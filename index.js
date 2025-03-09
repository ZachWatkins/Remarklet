import store from "./src/store.js";
import drag from "./src/drag.js";
import target from "./src/target.js";
import styles from "./src/styles.js";
import textedit from "./src/textedit.js";
styles();
drag();
target();
textedit();

export function activate() {
    store.set('active', true);
}
export function deactivate() {
    store.set('active', false);
}
