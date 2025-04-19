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
        const { clientX, clientY } = e.detail;
        if (hideZone.contains(clientX, clientY)) {
            hideZone.handleEnter();
        } else {
            hideZone.handleLeave();
        }
    });
    window.addEventListener("remarklet-dragend", (e) => {
        const { target, clientX, clientY } = e.detail;
        if (hideZone.contains(clientX, clientY)) {
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
    const pcs = window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const themes = {
        light: {
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderColor: "rgb(0, 0, 0)",
            boxShadowColor: "#f00",
        },
        dark: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderColor: "rgb(255, 255, 255)",
            boxShadowColor: "#f00",
        },
    };
    this.getTheme = function () {
        return pcs?.matches ? themes.dark : themes.light;
    };
    this.state = {
        visible: false,
        entered: false,
    };
    if (!document.querySelector("[data-remarklet-hide-zone]")) {
        this.element = document.createElement("div");
    } else {
        this.element = document.querySelector("[data-remarklet-hide-zone]");
    }
    this.element.setAttribute("data-remarklet-hide-zone", "");
    this.element.setAttribute("aria-label", "Hide Zone");
    this.element.style.position = "fixed";
    this.element.style.top = "0";
    this.element.style.right = "0";
    this.element.style.width = "100px";
    this.element.style.height = "100px";
    this.element.style.zIndex = "2147483647";
    this.element.style.display = "none";
    this.element.style.background = this.getTheme().backgroundColor;
    this.element.style.border = "10px dashed " + this.getTheme().borderColor;
    this.element.style.boxSizing = "border-box";
    this.element.style.pointerEvents = "none";
    this.element.style.transition = "box-shadow 0.2s";
    if (!document.querySelector("[data-remarklet-hide-zone]")) {
        document.body.appendChild(this.element);
    }
    this.contains = function (x, y) {
        const rect = this.element.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };
    this.updateTheme = function () {
        const theme = this.getTheme();
        this.element.style.background = theme.backgroundColor;
        this.element.style.border = "10px dashed " + theme.borderColor;
    };
    pcs.onchange = (e) => {
        this.updateTheme();
    };
    this.show = function () {
        this.element.style.display = "block";
    };
    this.hide = function () {
        this.element.style.display = "none";
        this.element.style.boxShadow = "none";
    };
    this.handleEnter = function () {
        if (this.state.entered) {
            return;
        }
        this.element.style.boxShadow =
            "0 0 0 4px " + this.getTheme().boxShadowColor;
        this.state.entered = true;
    };
    this.handleLeave = function () {
        if (!this.state.entered) {
            return;
        }
        this.element.style.boxShadow = "none";
        this.state.entered = false;
    };
}
