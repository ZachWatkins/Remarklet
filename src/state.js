/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
const state = {
    mode: "editing",
    editing: false,
    dragging: false,
    resizing: false,
    target: null,
    active: false,
    modifying: false,
    initialized: false,
    loading: false,
};

const subscribers = {
    mode: [],
    target: [],
    dragging: [],
    active: [],
    dragmove: [],
    dragend: [],
};

function setMode(mode) {
    if (mode !== state.mode) {
        if (state[state.mode]) {
            state[state.mode] = false;
        }
        if (typeof state[mode] !== "undefined") {
            state[mode] = true;
        }
        state.mode = mode;
        if (["dragging", "resizing"].includes(mode)) {
            state.modifying = true;
        } else {
            state.modifying = false;
        }
    }
}

export function set(key, value) {
    const oldValue = state[key];
    if (oldValue === value) {
        return;
    }
    if (key === "mode") {
        setMode(value);
    } else {
        state[key] = value;
    }
    if (subscribers[key] && subscribers[key].length) {
        subscribers[key].forEach((callback) => callback(value, oldValue));
    }
}

export function get(key) {
    return state[key];
}

/**
 * @typedef {function} SubscriberCallback
 * @callback SubscriberCallback
 * @param {any} value - The new value of the state.
 * @param {any} oldValue - The old value of the state.
 * @returns {void}
 */
/**
 * Subscribe function
 * @param {string} key - The key to subscribe to.
 * @param {SubscriberCallback} callback - The callback function to call when the state changes.
 * @returns {void}
 */
export function subscribe(key, callback) {
    if (!subscribers[key]) {
        subscribers[key] = [];
    }
    subscribers[key].push(callback);
}

/**
 * Publish function
 * @param {string} key - The key to publish.
 * @param {any} [value] - The value to publish.
 * @returns {void}
 */
export function publish(key, value) {
    if (subscribers[key]) {
        subscribers[key].forEach((callback) => callback(value));
    }
}

export default {
    set,
    get,
    subscribe,
    publish,
};
