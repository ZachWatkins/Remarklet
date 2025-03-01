// @ts-check
import { setMode } from "../global.js";

export default function DragButton() {
    let enabled = false;
    const el = document.createElement('button');
    el.id = "btn_on";
    el.innerHTML = "On";
    el.className = "w-1/2 text-white bg-black";
    const setEnabled = function (value) {
        enabled = Boolean(value);
        if (enabled) {
            el.innerHTML = "On";
            el.classList.remove("text-black", "bg-white");
            el.classList.add("text-white", "bg-black");
            setMode("drag");
        } else {
            el.innerHTML = "Off";
            el.classList.remove("text-white", "bg-black");
            el.classList.add("text-black", "bg-white");
            setMode("");
        }
    };
    el.addEventListener("click", function (e) {
        setEnabled(!enabled);
    });
    return el;
}
