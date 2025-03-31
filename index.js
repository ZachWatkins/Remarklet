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
 * @description The main module for the Remarklet library. It must be used as a singleton.
 * @example
 * import remarklet from "@zw/remarklet";
 *
 * // Initialize the library.
 * remarklet.activate();
 *
 * // Deactivate the library.
 * remarklet.deactivate();
 *
 * // Get the version of the library.
 * console.log(remarklet.version);
 *
 * // Configure the library.
 * remarklet.configure({
 *     persist: true,
 * });
 */
function remarklet() {}
let optionsSet = false;
/**
 * Configures the Remarklet library with the provided options.
 * @param {Object} options - The configuration options.
 * @param {boolean} options.persist - Whether to persist the state of the page between sessions.
 */
remarklet.options = function (options) {
    if (optionsSet) {
        console.error("Options have already been set.");
        return;
    }
    if (typeof options !== "object") {
        console.error("Options must be an object");
    }
    if (options.persist === true) {
        store.set("persist", true);
    }
    optionsSet = true;
};
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
