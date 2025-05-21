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
        hideZone = document.createElement("remarklet-hide-zone");
        document.body.appendChild(hideZone);
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
            changeMap.init(target, "hide");
            const map = changeMap.get(target);
            map.display = "none";
            map.transform = map.lastTransform;
            styles().mergeRule(map.selector, map.rule);
            changeMap.sync(target);
            target.removeAttribute("data-remarklet-highlight");
            state.set("target", null);
        }
        hideZone.hide();
    });
}

if (
    typeof HTMLElement !== "undefined" &&
    !window.customElements.get("remarklet-hide-zone")
) {
    /**
     * Web component for the HideZone overlay.
     * Isolates styling using Shadow DOM.
     */
    class HideZoneElement extends HTMLElement {
        constructor() {
            super();
            this.state = {
                visible: false,
                entered: false,
            };
            this.themes = {
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
            this.attachShadow({ mode: "open" });
            this._initShadow();
            this._setupTheme();
        }

        _initShadow() {
            const container = document.createElement("div");
            container.classList.add("container");
            container.setAttribute("aria-label", __("Hide"));
            container.innerHTML = __("Hide");
            this._container = container;
            const style = document.createElement("style");
            style.textContent = `
            :host {
                position: fixed;
                top: 0;
                right: 0;
                width: 100px;
                height: 100px;
                z-index: 2147483646;
                pointer-events: none;
                display: none;
                user-select: none;
            }
            .container {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: 2px;
                border-width: 4px;
                border-style: dashed;
                transition: border-color 0.5s, color 0.5s, opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                background-color: rgba(0, 0, 0, 0.15);
                text-align: center;
                line-height: 88px;
                color: rgba(0, 0, 0, 0.5);
                border-color: rgba(0, 0, 0, 0.5);
            }
        `;
            this.shadowRoot.append(style, container);
        }

        _setupTheme() {
            this.pcs = null;
            if (window.matchMedia) {
                this.pcs = window.matchMedia("(prefers-color-scheme: dark)");
                this.pcs.onchange = () => this._updateStyles();
            }
            __.subscribe(() => {
                this._container.innerHTML = __("Hide");
            });
            this._updateStyles();
        }

        _updateStyles() {
            window.requestAnimationFrame(() => {
                const state = this.state.entered ? "entered" : "visible";
                const theme = this.pcs?.matches
                    ? this.themes.dark[state]
                    : this.themes.light[state];
                this._container.style.borderColor = theme.borderColor;
                this._container.style.color = theme.color;
            });
        }

        contains(x, y) {
            const rect = this.getBoundingClientRect();
            return (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            );
        }

        /**
         * Show the hide zone with fade-in effect.
         */
        show() {
            if (!this.state.visible) {
                this.style.display = "block";
                // Force reflow to ensure transition
                void this.offsetWidth;
                this._container.style.opacity = 1;
                this.state.visible = true;
            }
        }

        /**
         * Hide the hide zone with fade-out effect.
         */
        hide() {
            if (this.state.visible) {
                this._container.style.opacity = 0;
                const onTransitionEnd = (event) => {
                    if (event.propertyName === "opacity") {
                        if (0 === this._container.style.opacity) {
                            this.style.display = "none";
                        }
                        this._container.removeEventListener(
                            "transitionend",
                            onTransitionEnd,
                        );
                    }
                };
                this._container.addEventListener(
                    "transitionend",
                    onTransitionEnd,
                );
                this.state.visible = false;
                this.state.entered = false;
            }
        }

        handleEnter() {
            if (this.state.entered) {
                return;
            }
            this.state.entered = true;
            this._updateStyles();
        }

        handleLeave() {
            if (!this.state.entered) {
                return;
            }
            this.state.entered = false;
            this._updateStyles();
        }
    }
    window.customElements.define("remarklet-hide-zone", HideZoneElement);
}
