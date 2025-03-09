/**
 * @module @zachwatkins/remarklet
 */
import store from "./src/store.js";
import drag from "./src/drag.js";
import target from "./src/target.js";
import styles from "./src/styles.js";
import textedit from "./src/textedit.js";
styles();
drag();
target();
textedit();

function activate () {
    store.set("active", true);
}
function deactivate () {
    store.set("active", false);
}

export default {
    activate,
    deactivate,
}
