/**
 * Remarklet (c) 2014-present Zachary Kendall Watkins. All rights reserved.
 * Licensed under the MIT License. See LICENSE.txt in the project root or go to
 * https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
 * full license information.
 */
export default function preventDefaultEvents(events) {
    this.preventing = {};
    this.events = [...events];

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
