const preventing = {};

function preventDefaultEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
}

/**
 * Prevents default events for the specified actions.
 * @param {string[]} events - The event names to prevent.
 * @return {void}
 */
export function on(events) {
    for (let i = 0; i < events.length; i++) {
        if (!preventing[events[i]]) {
            preventing[events[i]] = true;
            document.body.addEventListener(events[i], preventDefaultEvent, {
                capture: true,
            });
        }
    }
}

/**
 * Stops preventing default events for the specified actions.
 * @param {string[]} events - The event names to stop preventing.
 * @return {void}
 */
export function off(events) {
    for (let i = 0; i < events.length; i++) {
        if (preventing[events[i]]) {
            preventing[events[i]] = false;
            document.body.removeEventListener(events[i], preventDefaultEvent, {
                capture: true,
            });
        }
    }
}

export default {
    on,
    off,
};
