/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/

import state from "./state.js";
import changeMap from "./changeMap.js";
import styles from "./styles.js";

let currentHideableElement = null;
/**
 * Cleanup function to remove event listeners and attributes from the element
 */
function cleanupHideableElement() {
    if (currentHideableElement) {
        currentHideableElement.removeEventListener("keydown", listener, true);
    }
}

/**
 * @module hide
 * @description Hide elements on the page using a button for cross-device compatibility.
 */
export default function main() {
    if (state.get("hide") === false) {
        return;
    }
    state.subscribe("target", (target) => {
        cleanupHideableElement();
        if (!state.get("active") || state.get("mode") !== "editing") {
            return;
        }
        target?.addEventListener("keydown", listener, true);
    });
    function listener(event) {
        if (event.code === "Delete" || event.code === "Backspace") {
            event.stopPropagation();
            event.preventDefault();
            changeMap.init(event.target, "hide");
            const map = changeMap.get(event.target);
            map.display = "none";
            styles().mergeRule(map.selector, map.rule);
            changeMap.sync(event.target);
            event.target.removeAttribute("data-remarklet-highlight");
            state.set("target", null);
        }
    }
}
