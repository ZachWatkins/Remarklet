/*-----------------------------------------------------------------------------
 *  Copyright (c) Zachary Kendall Watkins. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for
 *  license information.
 *---------------------------------------------------------------------------*/
export default function preventDefaultEvents(events) {
    this.preventing = {};
    this.events = [...events];
    this.isOn = false;

    this.preventDefaultEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };

    /**
     * Prevents default events for the specified actions.
     * @return {void}
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
     * @return {void}
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
