import drag from "./drag.js";

const state = {
    mode: "idle",
    target: null,
    dragging: false,
    active: false,
};

const subscribers = {
    mode: [],
    target: [],
    dragging: [],
    active: [],
};

function setMode(mode) {
    if (mode === "dragging") {
        if (state.mode !== "dragging") {
            state.mode = "dragging";
            state.dragging = true;
            drag.activate();
        }
    } else if (state.mode === "dragging") {
        state.mode = mode;
        state.dragging = false;
        drag.deactivate();
    } else {
        state.mode = mode;
    }
}

export function set(key, value) {
    if (key === "mode") {
        setMode(value);
    } else {
        state[key] = value;
    }
    if (subscribers[key] && subscribers[key].length) {
        subscribers[key].forEach((callback) => callback(value));
    }
}

export function get(key) {
    return state[key];
}

export function subscribe(key, callback) {
    subscribers[key].push(callback);
}

export default {
    set,
    get,
    subscribe,
}
