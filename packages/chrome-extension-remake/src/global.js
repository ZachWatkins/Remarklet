const state = {
    mode: "",
    target: null,
    textTarget: null,
    dragging: false,
    window: null,
    body: null,
    clipboard: null,
};

export function setMode(mode) {
    state.mode = mode;
}

export default state;
