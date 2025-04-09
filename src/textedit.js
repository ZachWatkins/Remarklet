import state from "./state.js";

export default function main() {
    state.subscribe("target", (target, oldTarget) => {
        if (oldTarget) {
            oldTarget.removeAttribute("contenteditable");
        }
        if (!state.get("active")) {
            return;
        }
        if (target && "edit" === state.get("mode")) {
            target.setAttribute("contenteditable", "true");
        }
    });
    state.subscribe("mode", (mode) => {
        if (mode === "edit") {
            state.get("target")?.setAttribute("contenteditable", "true");
        } else {
            const target = state.get("target");
            if (target && target.hasAttribute("contenteditable")) {
                target.removeAttribute("contenteditable");
            }
        }
    });
}
