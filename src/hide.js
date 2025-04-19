/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/

import state from "./state.js";
import changeMap from "./changeMap.js";
import styles from "./styles.js";

let hideZoneElement = null;

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
    let hideZone = getHideZone();

    // Show/hide the hide zone based on drag mode
    state.subscribe("mode", (mode) => {
        if (mode === "dragging") {
            hideZone.style.display = "block";
        } else {
            hideZone.style.display = "none";
            hideZone.style.boxShadow = "none";
        }
    });

    // Listen for drag events.
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
        styles().mergeRule(map.selector, map.rule);
        changeMap.sync(target);
        target.removeAttribute("data-remarklet-highlight");
        state.set("target", null);
    }
}

/**
 * Get or create the hide zone element.
 * @returns {HTMLElement} The hide zone element.
 */
function getHideZone() {
    if (hideZoneElement) return hideZoneElement;
    hideZoneElement = document.createElement("div");
    hideZoneElement.setAttribute("data-remarklet-hide-zone", "");
    hideZoneElement.setAttribute("aria-label", "Hide Zone");
    hideZoneElement.style.position = "fixed";
    hideZoneElement.style.top = "0";
    hideZoneElement.style.right = "0";
    hideZoneElement.style.width = "100px";
    hideZoneElement.style.height = "100px";
    hideZoneElement.style.zIndex = "2147483647";
    hideZoneElement.style.display = "none";
    hideZoneElement.style.background = "rgba(255,255,255,0.5)";
    hideZoneElement.style.border = "10px dashed #fff";
    hideZoneElement.style.boxSizing = "border-box";
    hideZoneElement.style.pointerEvents = "none";
    hideZoneElement.style.transition = "box-shadow 0.2s";
    document.body.appendChild(hideZoneElement);
    return hideZoneElement;
}
