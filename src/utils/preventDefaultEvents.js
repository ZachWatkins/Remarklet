function preventDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
}

export default function preventDefaultEvents(events) {
    this.preventing = {};
    this.events = [...events];

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
                    preventDefaultEvent,
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
                    preventDefaultEvent,
                    {
                        capture: true,
                    },
                );
            }
        }
    };
}
