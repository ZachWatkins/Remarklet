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
            visible: {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "rgba(0, 0, 0, 0.5)",
            },
            entered: {
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(255, 255, 255, 1)",
                color: "rgba(0, 0, 0, 1)",
            },
        },
        dark: {
            visible: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderColor: "rgba(0, 0, 0, 0.5)",
                color: "rgba(255, 255, 255, 0.5)",
            },
            entered: {
                backgroundColor: "rgba(0, 0, 0, 1)",
                borderColor: "rgba(0, 0, 0, 1)",
                color: "rgba(255, 255, 255, 1)",
            },
        },
    };
    this.getTheme = function () {
        const state = this.state.entered ? "entered" : "visible";
        return pcs?.matches ? themes.dark[state] : themes.light[state];
    };
    this.updateStyles = function () {
        const theme = this.getTheme();
        this.element.style.borderColor = theme.borderColor;
        this.innerElement.style.backgroundColor = theme.backgroundColor;
        this.innerElement.style.color = theme.color;
    };
    this.state = {
        visible: false,
        entered: false,
    };
    if (document.querySelector("[data-remarklet-hide-zone]")) {
        this.element = document.querySelector("[data-remarklet-hide-zone]");
        this.innerElement = this.element.querySelector("div");
        this.updateStyles();
    } else {
        this.element = document.createElement("div");
        this.innerElement = document.createElement("div");
        this.innerElement.innerHTML = "Hide"; // Todo: replace with an eye icon with a diagonal line through it.
        Object.assign(this.innerElement.style, {
            textAlign: "center",
            lineHeight: "84px",
        });
        this.element.setAttribute("data-remarklet-hide-zone", "");
        this.element.setAttribute("aria-label", "Hide Zone");
        Object.assign(this.element.style, {
            position: "fixed",
            top: "0",
            right: "0",
            width: "100px",
            height: "100px",
            zIndex: "2147483647",
            display: "none",
            boxSizing: "border-box",
            pointerEvents: "none",
            transition: "box-shadow 0.2s",
            padding: "2px",
            borderWidth: "6px",
            borderStyle: "dashed",
        });
        this.element.appendChild(this.innerElement);
        this.updateStyles();
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
    pcs.onchange = (e) => {
        this.updateStyles();
    };
    this.show = function () {
        this.element.style.display = "block";
    };
    this.hide = function () {
        this.element.style.display = "none";
    };
    this.handleEnter = function () {
        if (this.state.entered) {
            return;
        }
        this.state.entered = true;
        this.updateStyles();
    };
    this.handleLeave = function () {
        if (!this.state.entered) {
            return;
        }
        this.state.entered = false;
        this.updateStyles();
    };
}
