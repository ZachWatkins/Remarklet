/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/

import state from "./state.js";
import changeMap from "./changeMap.js";
import styles from "./styles.js";
import __ from "./utils/translations.js";

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
    state.subscribe("dragmove", ({ target, clientX, clientY }) => {
        if (hideZone.contains(clientX, clientY)) {
            hideZone.handleEnter();
        } else {
            hideZone.handleLeave();
        }
    });
    state.subscribe("dragend", ({ target, clientX, clientY }) => {
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
                borderColor: "rgba(0, 0, 0, 0.5)",
                color: "rgba(0, 0, 0, 0.5)",
            },
            entered: {
                borderColor: "rgba(0, 0, 0, 1)",
                color: "rgba(0, 0, 0, 1)",
            },
        },
        dark: {
            visible: {
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "rgba(255, 255, 255, 0.5)",
            },
            entered: {
                borderColor: "rgba(255, 255, 255, 1)",
                color: "rgba(255, 255, 255, 1)",
            },
        },
    };
    this.getTheme = function () {
        const state = this.state.entered ? "entered" : "visible";
        return pcs?.matches ? themes.dark[state] : themes.light[state];
    };
    this.updateStyles = function () {
        window.requestAnimationFrame(() => {
            const theme = this.getTheme();
            this.element.style.borderColor = theme.borderColor;
            this.element.style.color = theme.color;
        });
    };
    this.state = {
        visible: false,
        entered: false,
    };
    this.element = document.createElement("div");
    this.innerElement = document.createElement("div");
    this.innerElement.innerHTML = __("Hide");
    __.subscribe(() => {
        this.innerElement.innerHTML = __("Hide");
    });
    Object.assign(this.innerElement.style, {
        textAlign: "center",
        lineHeight: "88px",
    });
    this.element.setAttribute("data-remarklet-hide-zone", "");
    this.element.setAttribute("aria-label", "Hide Zone");
    Object.assign(this.element.style, {
        position: "fixed",
        top: "0",
        right: "0",
        width: "100px",
        height: "100px",
        zIndex: "2147483646",
        boxSizing: "border-box",
        pointerEvents: "none",
        padding: "2px",
        borderWidth: "4px",
        borderStyle: "dashed",
        transition:
            "border-color 0.5s, color 0.5s, opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
        opacity: "0",
        display: "none",
    });
    this.element.appendChild(this.innerElement);
    this.updateStyles();
    document.body.appendChild(this.element);
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
    /**
     * Show the hide zone with fade-in effect.
     */
    this.show = function () {
        if (!this.state.visible) {
            this.element.style.display = "block";
            // Force reflow to ensure transition
            void this.element.offsetWidth;
            this.element.style.opacity = "1";
            this.state.visible = true;
        }
    };
    /**
     * Hide the hide zone with fade-out effect.
     */
    this.hide = function () {
        if (this.state.visible) {
            this.element.style.opacity = "0";
            // After transition, set display to none
            const onTransitionEnd = (event) => {
                if (event.propertyName === "opacity") {
                    this.element.style.display = "none";
                    this.element.removeEventListener(
                        "transitionend",
                        onTransitionEnd,
                    );
                }
            };
            this.element.addEventListener("transitionend", onTransitionEnd);
            this.state.visible = false;
            this.state.entered = false;
        }
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
