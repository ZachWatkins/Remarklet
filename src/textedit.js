import store from "./store.js";

let contentTarget = null;

export default function main() {
    store.subscribe("target", (target) => {
        if (!store.get("active")) {
            if (contentTarget) {
                contentTarget.removeAttribute("contenteditable");
                contentTarget = null;
            }
            return;
        }
        if (contentTarget) {
            contentTarget.removeAttribute("contenteditable");
            contentTarget = null;
        }
        if (target) {
            contentTarget = target;
            target.setAttribute("contenteditable", "true");
        }
    });
}
