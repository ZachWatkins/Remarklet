import store from "./store.js";

export default function main() {
    store.subscribe("target", (target, oldTarget) => {
        if (oldTarget) {
            oldTarget.removeAttribute("contenteditable");
        }
        if (!store.get("active")) {
            return;
        }
        if (target && "edit" === store.get("mode")) {
            target.setAttribute("contenteditable", "true");
        }
    });
    store.subscribe("mode", (mode) => {
        if (mode === "edit") {
            store.get("target")?.setAttribute("contenteditable", "true");
        } else {
            const target = store.get("target");
            if (target && target.hasAttribute("contenteditable")) {
                target.removeAttribute("contenteditable");
            }
        }
    });
}
