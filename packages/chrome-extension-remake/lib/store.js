import drag from "./drag.js";

const state = {
    mode: "idle",
    target: null,
    dragging: false,
};

export function setMode(mode) {
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

export function getMode() {
    return state.mode;
}
