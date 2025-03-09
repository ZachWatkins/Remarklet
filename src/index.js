import store from "./store.js";
import drag from "./drag.js";
import target from "./target.js";
import styles from "./styles.js";
import textedit from "./textedit.js";
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
