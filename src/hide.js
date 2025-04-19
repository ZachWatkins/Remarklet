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
 * Adds a fixed hide zone overlay for drag-to-hide functionality.
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

    // Create the hide zone overlay
    let hideZone = document.getElementById("remarklet-hide-zone");
    if (!hideZone) {
        hideZone = document.createElement("div");
        hideZone.id = "remarklet-hide-zone";
        hideZone.setAttribute("aria-label", "Hide Zone");
        hideZone.style.position = "fixed";
        hideZone.style.top = "0";
        hideZone.style.right = "0";
        hideZone.style.width = "100px";
        hideZone.style.height = "100px";
        hideZone.style.zIndex = "2147483647";
        hideZone.style.display = "none";
        hideZone.style.background = "rgba(255,255,255,0.5)";
        hideZone.style.border = "10px dashed #fff";
        hideZone.style.boxSizing = "border-box";
        hideZone.style.pointerEvents = "none";
        hideZone.style.transition = "box-shadow 0.2s";
        document.body.appendChild(hideZone);
    }

    // Show/hide the hide zone based on drag mode
    state.subscribe("mode", (mode) => {
        if (mode === "dragging") {
            hideZone.style.display = "block";
        } else {
            hideZone.style.display = "none";
            hideZone.style.boxShadow = "none";
        }
    });

    // Listen for drag events from Interact.js
    window.addEventListener("remarklet-dragmove", (e) => {
        const { target, clientX, clientY } = e.detail;
        const rect = hideZone.getBoundingClientRect();
        if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        ) {
            hideZone.style.boxShadow = "0 0 0 4px #f00";
            hideZone.setAttribute("data-remarklet-over", "true");
        } else {
            hideZone.style.boxShadow = "none";
            hideZone.removeAttribute("data-remarklet-over");
        }
    });
    window.addEventListener("remarklet-dragend", (e) => {
        const { target, clientX, clientY } = e.detail;
        const rect = hideZone.getBoundingClientRect();
        if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        ) {
            // Hide the element
            changeMap.init(target, "hide");
            const map = changeMap.get(target);
            map.display = "none";
            styles().mergeRule(map.selector, map.rule);
            changeMap.sync(target);
            target.removeAttribute("data-remarklet-highlight");
            state.set("target", null);
        }
        hideZone.style.boxShadow = "none";
        hideZone.removeAttribute("data-remarklet-over");
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
