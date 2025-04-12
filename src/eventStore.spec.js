import { EventStore } from "./eventStore.js";
import assert from "node:assert";
import test from "node:test";
import { getByTestId, waitFor } from "@testing-library/dom";
import "global-jsdom/register";
import { getUniqueSelector } from "./utils/cssSelector.js";

/**
 * Creates a test DOM element
 * @param {string} id - Test ID for the element
 * @returns {HTMLElement} The created element
 */
function createTestElement(id) {
    const element = document.createElement("div");
    element.setAttribute("data-testid", id);
    document.body.appendChild(element);
    return element;
}

test("EventStore can append and retrieve events", async () => {
    // Setup
    const eventStore = new EventStore({
        storageKey: "test_events",
        maxEvents: 100,
    });

    const testElement = createTestElement("test-element");

    // Test append method
    const eventData = { position: { x: 100, y: 200 } };
    const event = eventStore.append("drag", testElement, eventData);

    // Assertions
    assert.equal(event.type, "drag");
    assert.equal(event.targetSelector, 'div[data-testid="test-element"]');
    assert.deepEqual(event.data, eventData);
    assert.equal(typeof event.id, "string");
    assert.ok(event.timestamp > 0);
    assert.equal(event.sequence, 1);
});

test("EventStore can calculate element state", async () => {
    // Setup
    const eventStore = new EventStore();
    const testElement = createTestElement("state-element");

    // Add events in sequence
    eventStore.append("drag", testElement, { position: { x: 10, y: 20 } });
    eventStore.append("resize", testElement, {
        dimensions: { width: 300, height: 200 },
    });
    eventStore.append("contentChange", testElement, {
        innerHTML: "<p>Test content</p>",
    });
    eventStore.append("drag", testElement, { position: { x: 30, y: 40 } });

    // Get element state
    const state = eventStore.getElementState(testElement);

    // Assertions
    assert.deepEqual(state.position, { x: 30, y: 40 });
    assert.deepEqual(state.dimensions, { width: 300, height: 200 });
    assert.equal(state.innerHTML, "<p>Test content</p>");
});

test("EventStore can get current state for all elements", async () => {
    // Setup
    const eventStore = new EventStore();
    const element1 = createTestElement("element-1");
    const element2 = createTestElement("element-2");

    // Add events for multiple elements
    eventStore.append("drag", element1, { position: { x: 10, y: 20 } });
    eventStore.append("drag", element2, { position: { x: 30, y: 40 } });

    // Get current state
    const state = eventStore.getCurrentState();

    // Assertions
    assert.deepEqual(state['div[data-testid="element-1"]'].position, {
        x: 10,
        y: 20,
    });
    assert.deepEqual(state["element-2"].position, { x: 30, y: 40 });
});

test("EventStore supports event subscription", async () => {
    // Setup
    const eventStore = new EventStore();
    const element = createTestElement("subscribe-element");
    let receivedEvent = null;

    // Subscribe to events
    const unsubscribe = eventStore.subscribe((event) => {
        receivedEvent = event;
    });

    // Add an event
    const eventData = { position: { x: 50, y: 60 } };
    const event = eventStore.append("drag", element, eventData);

    // Assertions
    assert.deepEqual(receivedEvent, event);

    // Test unsubscribe
    unsubscribe();
    eventStore.append("resize", element, {
        dimensions: { width: 100, height: 100 },
    });
    assert.deepEqual(receivedEvent.type, "drag"); // Still the old event
});

test("EventStore can clear all events", async () => {
    // Setup
    const eventStore = new EventStore();
    const element = createTestElement("clear-element");

    // Add events
    eventStore.append("drag", element, { position: { x: 10, y: 20 } });

    // Clear events
    eventStore.clear();

    // Assertions
    assert.equal(eventStore.events.length, 0);
    assert.equal(eventStore.currentSequence, 0);
});

test("EventStore can export and import events", async () => {
    // Setup
    const eventStore1 = new EventStore({
        storageKey: "remarklet_events_export_test",
    });
    const element = createTestElement("export-element");

    // Add events to first store
    eventStore1.append("drag", element, { position: { x: 70, y: 80 } });

    // Export events
    const exported = eventStore1.export();

    // Create a new store and import
    const eventStore2 = new EventStore();
    const imported = eventStore2.import(exported);

    // Assertions
    assert.ok(imported);
    assert.equal(eventStore2.events.length, 1);
    assert.equal(eventStore2.events[0].type, "drag");
    assert.deepEqual(eventStore2.events[0].data, {
        position: { x: 70, y: 80 },
    });
});

test("EventStore handles replay of events", async () => {
    // Setup
    const eventStore = new EventStore({
        storageKey: "remarklet_events_replay_test",
    });
    const testElement = createTestElement("replay-element");
    const appliedStates = [];

    // Add events
    eventStore.append("drag", testElement, { position: { x: 10, y: 20 } });
    eventStore.append("resize", testElement, {
        dimensions: { width: 300, height: 200 },
    });

    // Clear DOM and recreate the element with the same ID to simulate page reload
    document.body.innerHTML = "";
    const reloadedElement = createTestElement("replay-element");

    // Mock apply function
    const applyFn = (element, state) => {
        appliedStates.push({
            selector: element.getAttribute("data-testid"),
            state: { ...state }, // Clone state to avoid reference issues
        });
    };

    // Replay events
    eventStore.replay(applyFn);

    // Assertions
    assert.equal(appliedStates.length, 1);
    assert.equal(appliedStates[0].selector, "replay-element");
    assert.deepEqual(appliedStates[0].state.position, { x: 10, y: 20 });
    assert.deepEqual(appliedStates[0].state.dimensions, {
        width: 300,
        height: 200,
    });
});
