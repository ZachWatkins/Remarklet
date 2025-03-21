/**
 * @module @zachwatkins/remarklet
 */
import pkg from "./package.json" with { type: "json" };
import store from "./src/store.js";
import drag from "./src/drag.js";
import target from "./src/target.js";
import styles from "./src/styles.js";
import textedit from "./src/textedit.js";

let initialized = false;

/**
 * @module remarklet
 * @description The main module for the Remarklet library.
 * @example
 * import remarklet from "@zw/remarklet";
 *
 * // Initialize the library
 * remarklet.activate();
 *
 * // Deactivate the library
 * remarklet.deactivate();
 *
 * // Get the version of the library
 * console.log(remarklet.version);
 */
function remarklet() {}

/**
 * Activates the Remarklet library, initializing all necessary components.
 * @example
 * remarklet.activate();
 */
remarklet.activate = function () {
    if (!initialized) {
        initialized = true;
        styles();
        drag();
        target();
        textedit();
    }
    store.set("active", true);
};
/**
 * Deactivates the Remarklet library, cleaning up any resources or event listeners.
 * @example
 * remarklet.deactivate();
 */
remarklet.deactivate = function () {
    store.set("active", false);
};
/**
 * Get the current version of the Remarklet library.
 * @example
 * remarklet.version;
 * // "1.0.4"
 */
remarklet.version = pkg.version;

export default remarklet;
