/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/

import state from "./state.js";
import changeMap from "./changeMap.js";
import styles from "./styles.js";

/**
 * @module hide
 * @description Hide elements on the page using a button for cross-device compatibility.
 */
export default function main() {
    if (state.get("hide") === false) {
        return;
    }
    if (state.get("mode") === "editing") {
        window.addEventListener("keydown", listener, true);
    }
    state.subscribe("mode", (mode) => {
        if (mode === "editing") {
            window.addEventListener("keydown", listener, true);
        } else {
            window.removeEventListener("keydown", listener, true);
        }
    });
}

/**
 * Event listener for the delete and backspace keys
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {void}
 */
function listener(event) {
    if (state.get("mode") !== "editing") {
        return;
    }
    if (event.code === "Delete" || event.code === "Backspace") {
        event.stopPropagation();
        event.preventDefault();
        const target = state.get("target");
        if (!target || target.tagName === "HTML" || target.tagName === "BODY") {
            return;
        }
        changeMap.init(target, "hide");
        const map = changeMap.get(target);
        map.display = "none";
        console.log(target);
        console.log(map);
        styles().mergeRule(map.selector, map.rule);
        changeMap.sync(target);
        target.removeAttribute("data-remarklet-highlight");
        state.set("target", null);
    }
}
