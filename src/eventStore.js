/**
 * @module EventStore
 *
 * This module implements an event store for tracking changes made to DOM elements
 * by the Remarklet library. Following the Event Sourcing pattern, it stores a sequence
 * of immutable events that represent all actions performed on DOM elements.
 *
 * The event store acts as the system of record (source of truth) about the current
 * state of elements modified by Remarklet. Instead of storing just the current state,
 * we store the complete sequence of events that led to the current state.
 *
 * Benefits:
 * - Complete audit trail of all changes
 * - Ability to replay events to reconstruct the state at any point in time
 * - Decoupled from the presentation layer
 * - No update conflicts as events are append-only
 */

// Import required modules
import { getUniqueSelector } from "./utils/cssSelector.js";
import LocalStorageItem from "./utils/LocalStorageItem.js";

/**
 * @typedef {Object} DOMEvent
 * @property {string} id - Unique identifier for the event
 * @property {string} type - Type of event (e.g., 'drag', 'resize', 'contentChange')
 * @property {string} targetSelector - CSS selector for the target element
 * @property {Object} data - Event-specific data
 * @property {number} timestamp - When the event occurred
 * @property {number} sequence - Sequence number for ordering events
 * @property {string} [version] - Schema version for backwards compatibility
 */

/**
 * EventStore class for managing DOM modification events
 */
class EventStore {
    constructor(options = {}) {
        this.options = {
            storageKey: "remarklet_events",
            maxEvents: 1000,
            snapshotFrequency: 50,
            ...options,
        };

        // Initialize storage
        this.storage = new LocalStorageItem({
            key: this.options.storageKey,
            defaultValue: [],
            type: "object",
        });
        this.events = this.storage.value;
        this.subscribers = [];
        this.currentSequence = this.getLastSequence();

        // Snapshots for optimization
        this.snapshots = new LocalStorageItem({
            key: "remarklet_snapshots",
            defaultValue: {},
            type: "object",
        });
        this.snapshotCache = this.snapshots.value;
    }

    /**
     * Get the last sequence number used
     * @returns {number} Last sequence number or 0
     */
    getLastSequence() {
        if (!this.events.length) return 0;
        return this.events[this.events.length - 1].sequence;
    }

    /**
     * Append a new event to the store
     * @param {string} type - Event type
     * @param {HTMLElement} targetElement - The DOM element affected
     * @param {Object} data - Event-specific data
     * @returns {DOMEvent} The created event
     */
    append(type, targetElement, data) {
        if (!targetElement || !type) {
            throw new Error("Event requires both type and target element");
        }

        // Create a selector that can uniquely identify this element later
        const targetSelector = getUniqueSelector(targetElement);

        // Create the event object
        const event = {
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            targetSelector,
            data,
            timestamp: Date.now(),
            sequence: ++this.currentSequence,
            version: "1.0.9",
        };

        // Add event to store
        this.events.push(event);
        this.storage.value = this.events;
        this.storage.store();

        // Create periodic snapshots for performance
        if (this.currentSequence % this.options.snapshotFrequency === 0) {
            this.createSnapshot();
        }

        // Trim if needed
        if (this.events.length > this.options.maxEvents) {
            // Before trimming, ensure we have a snapshot
            this.createSnapshot();
            this.events = this.events.slice(-this.options.maxEvents);
            this.storage.value = this.events;
            this.storage.store();
        }

        // Notify subscribers
        this.notifySubscribers(event);

        return event;
    }

    /**
     * Create a snapshot of the current state for all elements
     * This improves performance when reconstructing state
     */
    createSnapshot() {
        const state = this.getCurrentState();
        this.snapshotCache = {
            timestamp: Date.now(),
            sequence: this.currentSequence,
            state,
        };
        this.snapshots.value = this.snapshotCache;
        this.snapshots.store();
    }

    /**
     * Get events for a specific DOM element
     * @param {HTMLElement|string} target - Element or selector
     * @returns {Array<DOMEvent>} Matching events
     */
    getEventsForElement(target) {
        const selector =
            typeof target === "string" ? target : getUniqueSelector(target);
        return this.events.filter((event) => event.targetSelector === selector);
    }

    /**
     * Calculate the current state of an element based on its event history
     * @param {HTMLElement|string} target - Element or selector
     * @returns {Object} Current state
     */
    getElementState(target) {
        const selector =
            typeof target === "string" ? target : getUniqueSelector(target);
        const events = this.getEventsForElement(selector);

        // Start with initial state
        let state = {};

        // Apply each event to build up the current state
        for (const event of events) {
            switch (event.type) {
                case "drag":
                    state.position = event.data.position;
                    break;
                case "resize":
                    state.dimensions = event.data.dimensions;
                    break;
                case "contentChange":
                    state.innerHTML = event.data.innerHTML;
                    break;
                default:
                    // Custom event types can be handled here
                    if (!state.custom) state.custom = {};
                    state.custom[event.type] = event.data;
            }
        }

        return state;
    }

    /**
     * Get the current state for all elements that have events
     * @returns {Object} Map of element selectors to their current states
     */
    getCurrentState() {
        const elementSelectors = [
            ...new Set(this.events.map((event) => event.targetSelector)),
        ];
        const state = {};

        for (const selector of elementSelectors) {
            state[selector] = this.getElementState(selector);
        }

        return state;
    }

    /**
     * Apply all stored events to reconstruct the UI state
     * @param {Function} applyFn - Function to apply state to an element
     */
    replay(applyFn) {
        if (typeof applyFn !== "function") {
            throw new Error(
                "Replay requires a function to apply state to elements",
            );
        }

        // Use snapshot if available for better performance
        if (this.snapshotCache && this.snapshotCache.state) {
            const { state } = this.snapshotCache;

            // Apply snapshot state
            for (const [selector, elementState] of Object.entries(state)) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        applyFn(element, elementState);
                    }
                } catch (error) {
                    console.error(
                        `Failed to apply state to ${selector}:`,
                        error,
                    );
                }
            }

            // Apply any events that came after the snapshot
            const remainingEvents = this.events.filter(
                (event) => event.sequence > this.snapshotCache.sequence,
            );

            for (const event of remainingEvents) {
                try {
                    const element = document.querySelector(
                        event.targetSelector,
                    );
                    if (element) {
                        // Apply just this event
                        const partialState = {};
                        switch (event.type) {
                            case "drag":
                                partialState.position = event.data.position;
                                break;
                            case "resize":
                                partialState.dimensions = event.data.dimensions;
                                break;
                            case "contentChange":
                                partialState.innerHTML = event.data.innerHTML;
                                break;
                            default:
                                if (!partialState.custom)
                                    partialState.custom = {};
                                partialState.custom[event.type] = event.data;
                        }
                        applyFn(element, partialState);
                    }
                } catch (error) {
                    console.error(
                        `Failed to apply event to ${event.targetSelector}:`,
                        error,
                    );
                }
            }
        } else {
            // No snapshot, apply all events in sequence
            const state = this.getCurrentState();
            for (const [selector, elementState] of Object.entries(state)) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        applyFn(element, elementState);
                    }
                } catch (error) {
                    console.error(
                        `Failed to apply state to ${selector}:`,
                        error,
                    );
                }
            }
        }
    }

    /**
     * Subscribe to events
     * @param {Function} callback - Function to call when events are appended
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        if (typeof callback !== "function") {
            throw new Error("Subscriber must be a function");
        }

        this.subscribers.push(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(
                (sub) => sub !== callback,
            );
        };
    }

    /**
     * Notify all subscribers of a new event
     * @param {DOMEvent} event - The event that was added
     * @private
     */
    notifySubscribers(event) {
        for (const subscriber of this.subscribers) {
            try {
                subscriber(event);
            } catch (error) {
                console.error("Error in event subscriber:", error);
            }
        }
    }

    /**
     * Clear all events
     */
    clear() {
        this.events = [];
        this.storage.value = this.events;
        this.storage.store();
        this.snapshotCache = {};
        this.snapshots.value = this.snapshotCache;
        this.snapshots.store();
        this.currentSequence = 0;
    }

    /**
     * Export all events to JSON
     * @returns {string} JSON string of all events
     */
    export() {
        return JSON.stringify({
            version: "1.0.9",
            timestamp: Date.now(),
            events: this.events,
        });
    }

    /**
     * Import events from JSON
     * @param {string} json - JSON string to import
     * @returns {boolean} Success status
     */
    import(json) {
        try {
            const data = JSON.parse(json);
            if (!data.events || !Array.isArray(data.events)) {
                throw new Error("Invalid event data format");
            }

            // Validate events
            for (const event of data.events) {
                if (!event.id || !event.type || !event.targetSelector) {
                    throw new Error("Invalid event format");
                }
            }

            this.events = data.events;
            this.storage.value = this.events;
            this.storage.store();
            this.currentSequence = this.getLastSequence();

            // Recreate snapshot
            this.createSnapshot();

            return true;
        } catch (error) {
            console.error("Failed to import events:", error);
            return false;
        }
    }
}

// Create and export a singleton instance
const eventStore = new EventStore();
export default eventStore;

// Also export the class for testing or custom instances
export { EventStore };
