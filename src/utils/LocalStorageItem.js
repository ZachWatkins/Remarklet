/**
 * @package Remarklet
 * @class LocalStorageItem
 * @description A class for safely interacting with localStorage items.
 * @author Zachary K. Watkins, <watkinza@gmail.com>
 */

/**
 * A class for safely interacting with localStorage items.
 */
export default class LocalStorageItem {
    #state;

    /**
     * The value of the localStorage item.
     * @type {any}
     */
    value;

    /**
     * Whether the localStorage item was restored from a previous state.
     * @type {boolean}
     */
    restored = false;

    /**
     * Creates a new localStorage item interface.
     * @param {object} props - The properties for the localStorage item.
     * @param {string} props.key - The localStorage item's key.
     * @param {any} props.defaultValue - The default value to return if the item does not exist.
     * @param {string} props.type - The type of the item (e.g., "string", "number", "object").
     */
    constructor({ key, defaultValue, type }) {
        this.#state = {
            key,
            type,
            defaultValue,
            bytes: 0,
            storageError: null,
            parseError: null,
            accessError: null,
        };

        let value;
        if ("object" === type) {
            try {
                let stored = localStorage.getItem(key);
                if (stored !== null) {
                    try {
                        value = JSON.parse(stored);
                        this.restored = true;
                    } catch (error) {
                        this.#state.parseError = error;
                        value = defaultValue;
                    }
                } else {
                    value = defaultValue;
                }
            } catch (error) {
                this.#state.accessError = error;
                value = defaultValue;
            }
        } else {
            try {
                let stored = localStorage.getItem(key);
                if (stored !== null) {
                    value = stored;
                    this.restored = true;
                } else {
                    value = defaultValue;
                }
            } catch (error) {
                this.#state.accessError = error;
                value = defaultValue;
            }
        }
        this.value = value;
    }

    /**
     * Get the number of bytes stored for the item in localStorage.
     *
     * @returns {number} - The number of bytes stored.
     */
    get bytes() {
        let value =
            localStorage[this.#state.key]?.length ||
            JSON.stringify(this.value).length;
        value += this.#state.key.length;
        value *= 2; // Convert to byte length.
        return value;
    }

    get storageError() {
        return this.#state.storageError;
    }

    get accessError() {
        return this.#state.accessError;
    }

    get parseError() {
        return this.#state.parseError;
    }

    /**
     * Save the current value to localStorage.
     * If the item is an object, it will be stringified before saving.
     * Otherwise, it will be saved as is.
     *
     * @returns {void}
     */
    store() {
        try {
            if (this.#state.type === "object") {
                localStorage.setItem(
                    this.#state.key,
                    JSON.stringify(this.value),
                );
            } else {
                localStorage.setItem(this.#state.key, this.value);
            }
        } catch (error) {
            this.#state.storageError = error;
            this.#state.parseError = error;
        }
    }

    /**
     * Delete the item from localStorage.
     * @returns {void}
     */
    unstore() {
        localStorage.removeItem(this.#state.key);
    }
}
