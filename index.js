/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/
// Remarklet is a library for visually manipulating web page content.
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
 * remarklet.restore();
 * remarklet.activate();
 * remarklet.deactivate();
 * console.log(remarklet.version);
 * remarklet.options({
 *     persist: true, // default: false.
 *     hide: true, // default: false.
 * });
 */
function remarklet() {}

/**
 * @private
 */
const app = {
    optionsSet: false,
    optionsWarned: false,
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
 * @returns {void}
 * @since 1.1.0
 */
remarklet.options = function (options) {
    if (app.optionsSet) {
        if (app.optionsWarned) {
            return;
        }
        console.warn("Remarklet options are already set.");
        app.optionsWarned = true;
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
 * Restores the persisted changes, if any. Can be used before calling `remarklet.activate()`.
 * @returns {void}
 * @since 1.2.0
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
 * @returns {void}
 * @since 1.0.0
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
 * @returns {void}
 * @since 1.0.0
 */
remarklet.deactivate = function () {
    state.set("active", false);
    state.set("target", null);
};

/**
 * Get the version number of the Remarklet library in use.
 * @type {"1.2.14"}
 * @readonly
 * @since 1.0.2
 */
remarklet.version = "1.2.14";

export default remarklet;
