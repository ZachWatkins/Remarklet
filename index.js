/**
 * @module @zw/remarklet
 * @description Remarklet is a library for visually manipulating web page content.
 * @author Zachary Kendall Watkins
 * @copyright 2014-present Zachary Kendall Watkins. All rights reserved.
 * @license
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
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
 * @type {function}
 * @returns {void}
 */
function remarklet() {}

/**
 * @private
 */
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
 * @since 1.3.0
 * @description Configures the library's features.
 * @param {Object} options - The configuration options.
 * @param {boolean} options.persist - Whether to persist the state of the page between sessions.
 * @param {boolean} options.hide - Whether to hide certain elements.
 * @returns {void}
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
 * @deprecated
 * @since 1.1.0
 * @description Deprecated. An alias of remarklet.config. Will be removed in v2.0.0.
 * @param {Object} options - The configuration options.
 * @param {boolean} options.persist - Whether to persist the state of the page between sessions.
 * @param {boolean} options.hide - Whether to hide certain elements.
 * @returns {void}
 */
remarklet.options = function (options) {
    remarklet.config(options);
};

/**
 * @since 1.2.0
 * @description Restores the persisted changes, if any. Runs before the interactive features are initialized.
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
 * @since 1.3.0
 * @function
 * @description Deletes all Remarklet data from localStorage.
 * @returns {void}
 */
remarklet.unstore = function () {
    changeMap.unstore();
};

/**
 * @since 1.0.0
 * @function
 * @description Activates the Remarklet library, initializing all necessary components.
 * @returns {void}
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
 * @since 1.0.0
 * @function
 * @description Deactivates the Remarklet library, cleaning up any resources or event listeners.
 * @returns {void}
 */
remarklet.deactivate = function () {
    state.set("active", false);
    state.set("target", null);
};

/**
 * @since 1.0.2
 * @type {readonly string}
 * @readonly
 * @const {string}
 * @description Get the current version of the Remarklet library.
 */
remarklet.version = pkg.version;

export default remarklet;
