/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/
// Remarklet is a library for visually manipulating web page content.
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
 * @description The main module for the Remarklet library.
 * @example
 * import remarklet from "@zw/remarklet";
 *
 * // Restore changes from localStorage.
 * remarklet.restore();
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
 *     persist: true, // default: false.
 *     hide: true, // default: false.
 * });
 */
function remarklet() {}
const app = {
    optionsSet: false,
    loading: false,
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
 * Configures the Remarklet library with the provided options.
 * @param {Object} options - The configuration options.
 * @param {boolean} [options.persist] - Whether to persist the state of the page between sessions.
 * @param {boolean} [options.hide] - Whether to hide certain elements.
 */
remarklet.options = function (options) {
    if (app.optionsSet) {
        console.error("Options are already set.");
        return;
    }
    if (typeof options !== "object") {
        console.error("Options must be an object");
        return;
    }
    if (options.persist === true) {
        state.set("persist", true);
    }
    if (options.hide === true) {
        state.set("hide", true);
    }
    app.optionsSet = true;
};

/**
 * Restores the persisted changes, if any.
 * Runs before the interactive features are initialized.
 * @returns {void}
 */
remarklet.restore = function () {
    if (app.loading) {
        console.warn("Loading is already in progress.");
        return;
    }
    app.loading = true;
    if (!state.get("persist")) {
        state.set("persist", true);
    }
    app.use(changeMap);
    app.use(styles);
    app.loading = false;
};

/**
 * Activates the Remarklet library, initializing all necessary components.
 * @example
 * remarklet.activate();
 */
remarklet.activate = function () {
    if (!state.get("initialized") && !app.loading) {
        app.loading = true;
        app.use(changeMap);
        app.use(styles);
        app.use(drag);
        app.use(target);
        app.use(textedit);
        app.use(hide);
        state.set("initialized", true);
        app.loading = false;
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
    state.set("target", null);
};

/**
 * Get the current version of the Remarklet library.
 * @example
 * remarklet.version;
 * // "1.2.8"
 */
remarklet.version = pkg.version;

export default remarklet;
