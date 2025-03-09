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

exports.activate = function () {
    store.set("active", true);
}
exports.deactivate = function () {
    store.set("active", false);
}
