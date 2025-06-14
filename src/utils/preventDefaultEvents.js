/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/
export default function preventDefaultEvents(events) {
    /**
     * An object to track which events are currently being prevented.
     * @type {Object.<string, boolean>}
     * @default {}
     */
    this.preventing = {};

    /**
     * An array of event types to prevent.
     * @type {Array<string>}
     * @default []
     */
    this.events = [...events];

    /**
     * Indicates whether the default event prevention is currently active.
     * @type {boolean}
     * @default false
     */
    this.isOn = false;

    /**
     * Prevents the default action of an event and stops its propagation.
     * @type {function}
     * @param {Event} event - The event to prevent.
     * @returns {void}
     */
    this.preventDefaultEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };

    /**
     * Prevents default events for the specified actions.
     * @type {function}
     * @returns {void}
     */
    this.on = function () {
        if (this.isOn) {
            return;
        }
        this.isOn = true;
        for (let i = 0; i < this.events.length; i++) {
            if (!this.preventing[this.events[i]]) {
                this.preventing[this.events[i]] = true;
                document.body.addEventListener(
                    this.events[i],
                    this.preventDefaultEvent,
                    {
                        capture: true,
                    },
                );
            }
        }
    };

    /**
     * Stops preventing default events for the specified actions.
     * @type {function}
     * @returns {void}
     */
    this.off = function () {
        if (!this.isOn) {
            return;
        }
        this.isOn = false;
        for (let i = 0; i < this.events.length; i++) {
            if (this.preventing[this.events[i]]) {
                this.preventing[this.events[i]] = false;
                document.body.removeEventListener(
                    this.events[i],
                    this.preventDefaultEvent,
                    {
                        capture: true,
                    },
                );
            }
        }
    };
}
