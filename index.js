/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
// Remarklet is a library for visually manipulating web page content.
import pkg from "./package.json" with { type: "json" };
import state from "./src/state.js";
import drag from "./src/drag.js";
import target from "./src/target.js";
import styles from "./src/styles.js";
import textedit from "./src/textedit.js";
import changeMap from "./src/changeMap.js";
import hide from "./src/hide.js";
import config from "./src/config.js";

/**
 * @module remarklet
 * @description The main module for the Remarklet library.
 * @example
 * import remarklet from "@zw/remarklet";
 *
 * // Optional: configure the library.
 * remarklet.configure({
 *     persist: true, // default: false.
 *     hide: true, // default: false.
 * });
 *
 * // Restore changes from localStorage without activating the rest of the library.
 * remarklet.restore();
 *
 * // Delete all Remarklet data from localStorage (cannot be undone).
 * remarklet.unstore();
 *
 * // Initialize the library.
 * remarklet.activate();
 *
 * // Deactivate the library.
 * remarklet.deactivate();
 *
 * // Get the version of the library.
 * console.log(remarklet.version);
 */
function remarklet() {}
const app = {
    using: [],
    use: function (callback) {
        if (typeof callback === "function") {
            if (this.using.includes(callback)) {
                return;
            }
            this.using.push(callback);
            callback();
        } else {
            console.error("Callback must be a function");
        }
    },
};

/**
 * Configures the library.
 * @param {Object} options - The configuration options.
 * @param {boolean} options.persist - Whether to persist the state of the page between sessions.
 * @param {boolean} options.hide - Whether to hide certain elements.
 * @return {void}
 */
remarklet.config = function (options) {
    if (options.persist === true) {
        config.persist = true;
    }
    if (options.hide === true) {
        config.hide = true;
    }
};

/**
 * Deprecated. An alias of remarklet.config. Will be removed in v2.0.0.
 * @deprecated
 * @param {Object} options - The configuration options.
 * @param {boolean} options.persist - Whether to persist the state of the page between sessions.
 * @param {boolean} options.hide - Whether to hide certain elements.
 * @return {void}
 */
remarklet.options = remarklet.config;

/**
 * Restores the persisted changes, if any.
 * Runs before the interactive features are initialized.
 * @returns {void}
 */
remarklet.restore = function () {
    if (state.get("loading") === true) {
        console.warn("Loading is already in progress.");
        return;
    }
    state.set("loading", true);
    if (config.persist !== true) {
        config.persist = true;
    }
    app.use(changeMap);
    app.use(styles);
    state.set("loading", false);
};

/**
 * Deletes all Remarklet data from localStorage.
 * @returns {void}
 */
remarklet.unstore = function () {
    changeMap.unstore();
};

/**
 * Activates the Remarklet library, initializing all necessary components.
 * @example
 * remarklet.activate();
 */
remarklet.activate = function () {
    if (!state.get("initialized") && !state.get("loading")) {
        state.set("loading", true);
        app.use(changeMap);
        app.use(styles);
        app.use(drag);
        app.use(target);
        app.use(textedit);
        if (config.hide === true) {
            app.use(hide);
        }
        state.set("initialized", true);
        state.set("loading", false);
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
 * // "1.2.3"
 */
remarklet.version = pkg.version;

export default remarklet;
