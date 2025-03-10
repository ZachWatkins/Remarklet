const state = {
    mode: "idle",
    dragging: false,
    resizing: false,
    target: null,
    active: false,
    modifying: false,
};

const subscribers = {
    mode: [],
    target: [],
    dragging: [],
    active: [],
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

export function subscribe(key, callback) {
    subscribers[key].push(callback);
}

export default {
    set,
    get,
    subscribe,
}
