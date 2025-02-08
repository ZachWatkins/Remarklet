// @ts-check
import { setMode } from "../global.js";

export function init() {
    const id = "btn_on";
    let button = document.querySelector(`.remarklet #${id}`);
    if (!button) {
        button = createButton({ id });
    }
}

/**
 * Create the button element.
 * @param {object?} props
 * @returns {HTMLButtonElement}
 */
function createButton(props) {
    let enabled = false;
    const el = document.createElement('button');
    el.id = props.id;
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
