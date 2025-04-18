/**
 * Remarklet - A JavaScript library for visually manipulating web page content.
 * @author Zachary Kendall Watkins
 * @copyright 2014-2025 Zachary Kendall Watkins, All Rights Reserved
 * @license MIT
 */
import pkg from "./package.json" with { type: "json" };
import state from "./src/state.js";
import drag from "./src/drag.js";
import target from "./src/target.js";
import styles from "./src/styles.js";
import textedit from "./src/textedit.js";
import changeMap from "./src/changeMap.js";
import hide from "./src/hide.js";

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
        console.error("Options are already set.");
        return;
    }
    if (typeof options !== "object") {
        console.error("Options must be an object");
    }
    if (options.persist === true) {
        state.set("persist", true);
    }
    if (typeof options.hide !== "undefined") {
        state.set("hide", options.hide);
    }
    optionsSet = true;
};
let loading = false;
/**
 * Activates the Remarklet library, initializing all necessary components.
 * @example
 * remarklet.activate();
 */
remarklet.activate = function () {
    if (!state.get("initialized") && !loading) {
        loading = true;
        changeMap();
        styles();
        drag();
        target();
        textedit();
        hide();
        state.set("initialized", true);
        loading = false;
    }
    state.set("active", true);
};
/**
 * Deactivates the Remarklet library, cleaning up any resources or event listeners.
 * @example
 * remarklet.deactivate();
 */
remarklet.deactivate = function () {
    state.set("active", false);
};
/**
 * Get the current version of the Remarklet library.
 * @example
 * remarklet.version;
 * // "1.0.4"
 */
remarklet.version = pkg.version;

export default remarklet;
