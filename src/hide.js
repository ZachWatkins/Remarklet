/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/

import state from "./state.js";
import changeMap from "./changeMap.js";
import styles from "./styles.js";

let hideZone = null;

/**
 * @module hide
 * @description Hide elements on the page using a button for cross-device compatibility.
 * Adds a fixed hide zone overlay for drag-to-hide functionality.
 */
export default function main() {
    if (state.get("hide") === false) {
        return;
    }
    if (!hideZone) {
        hideZone = new HideZone();
    }

    // Show/hide the hide zone based on drag mode
    state.subscribe("mode", (mode) => {
        if (mode === "dragging") {
            hideZone.show();
        } else {
            hideZone.hide();
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
            hideZone.handleEnter();
        } else {
            hideZone.handleLeave();
        }
    });
    window.addEventListener("remarklet-dragend", (e) => {
        const { target, clientX, clientY } = e.detail;
        if (hideZone.checkEntered(clientX, clientY)) {
            // Hide the element
            changeMap.init(target, "hide");
            const map = changeMap.get(target);
            map.display = "none";
            styles().mergeRule(map.selector, map.rule);
            changeMap.sync(target);
            target.removeAttribute("data-remarklet-highlight");
            state.set("target", null);
        }
        hideZone.hide();
    });
}

/**
 * Create the hide zone element.
 */
function HideZone() {
    this.element = document.createElement("div");
    this.element.setAttribute("data-remarklet-hide-zone", "");
    this.element.setAttribute("aria-label", "Hide Zone");
    this.element.style.position = "fixed";
    this.element.style.top = "0";
    this.element.style.right = "0";
    this.element.style.width = "100px";
    this.element.style.height = "100px";
    this.element.style.zIndex = "2147483647";
    this.element.style.display = "none";
    this.element.style.background = "rgba(255,255,255,0.5)";
    this.element.style.border = "10px dashed #fff";
    this.element.style.boxSizing = "border-box";
    this.element.style.pointerEvents = "none";
    this.element.style.transition = "box-shadow 0.2s";
    document.body.appendChild(this.element);
    this.show = function () {
        this.element.style.display = "block";
    };
    this.hide = function () {
        this.element.style.display = "none";
        this.element.style.boxShadow = "none";
    };
    this.toggle = function () {
        if (this.element.style.display === "none") {
            this.show();
        } else {
            this.hide();
        }
    };
    this.handleEnter = function () {
        this.element.style.boxShadow = "0 0 0 4px #f00";
        this.element.setAttribute("data-remarklet-over", "true");
    };
    this.handleLeave = function () {
        this.element.style.boxShadow = "none";
        this.element.removeAttribute("data-remarklet-over");
    };
    this.checkEntered = function (x, y) {
        const rect = this.element.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };
}
