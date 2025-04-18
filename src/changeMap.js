import state from "./state.js";
import { getUniqueSelector } from "./utils/cssSelector";
import LocalStorageItem from "./utils/LocalStorageItem";
const elementChangeMap = new WeakMap();
let store = null;

/**
 * @typedef {Object} ElementState
 * @property {string} selector - The selector of the item.
 * @property {string} initialStyle - The initial style of the item.
 * @property {boolean} restored - Whether the item has been restored.
 * @property {boolean} dragged - Whether the item has been dragged.
 * @property {boolean} resized - Whether the item has been resized.
 * @property {boolean} matrix3d - Whether the element position should be styled using matrix3d.
 * @property {number} x - The transform's x value.
 * @property {number} y - The transform's y value.
 * @property {number} width - The width value in pixels.
 * @property {number} height - The height value in pixels.
 * @property {number} marginBottom - The bottom margin in pixels.
 * @property {number} marginRight - The right margin in pixels.
 * @property {Array<number>} transform - The transform matrix.
 * @property {string} transformText - The transform text representation.
 * @property {string} rule - The CSS rule for the item.
 * @property {(deltaX: number, deltaY: number) => void} move - Moves the item by deltaX and/or deltaY.
 */
/**
 * @constructor
 * @param {HTMLElement} target - The target element.
 * @param {Object} [props] - The properties of the change map item.
 * @param {boolean} [props.restored] - Whether the item has been restored.
 * @param {boolean} [props.dragged] - Whether the item has been dragged.
 * @param {boolean} [props.resized] - Whether the item has been resized.
 * @returns {ElementState} The element state object.
 */
function ElementState(target, props = {}) {
    const computed = window.getComputedStyle(target);
    this.selector =
        props.selector ||
        getUniqueSelector(target, {
            excludeDataAttributePrefix: "remarklet",
        });
    this.initialStyle = target.style.cssText.replace(/cursor:[^;]+;?/g, "");
    this.restored = props.restored || false;
    this.dragged = props.dragged || false;
    this.resized = props.resized || false;
    this.edited = props.edited || false;
    this.content = typeof props.content === "string" ? props.content : null;
    this.width = parseFloat(computed.width);
    this.height = parseFloat(computed.height);
    this.marginBottom = parseFloat(computed.marginBottom);
    this.marginRight = parseFloat(computed.marginRight);
    this.matrix3d = computed.transform.indexOf("matrix3d(") >= 0;
    if (props.transform) {
        this.transform = props.transform;
    } else if (computed.transform === "none") {
        this.transform = [1, 0, 0, 1, 0, 0];
    } else if (!this.matrix3d) {
        const matrixRegex = /matrix\(([^)]+)\)/;
        const matrixMatch = computed.transform.match(matrixRegex);
        if (matrixMatch) {
            this.transform = matrixMatch[1]
                .split(",")
                .map((v) => parseFloat(v));
        } else {
            // This shouldn't happen, but just in case.
            this.transform = [1, 0, 0, 1, 0, 0];
        }
    } else {
        const matrix3dRegex = /matrix3d\(([^)]+)\)/;
        const matrix3dMatch = computed.transform.match(matrix3dRegex);
        if (matrix3dMatch) {
            this.transform = matrix3dMatch[1]
                .split(",")
                .map((v) => parseFloat(v));
        } else {
            this.transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
    }
    if (!this.matrix3d) {
        Object.defineProperties(this, {
            x: {
                get() {
                    return this.transform[4];
                },
                set(value) {
                    this.transform[4] = value;
                },
            },
            y: {
                get() {
                    return this.transform[5];
                },
                set(value) {
                    this.transform[5] = value;
                },
            },
            transformText: {
                get() {
                    return `matrix(${this.transform.join(", ")})`;
                },
            },
        });
    } else {
        Object.defineProperties(this, {
            x: {
                get() {
                    return this.transform[12];
                },
                set(value) {
                    this.transform[12] = value;
                },
            },
            y: {
                get() {
                    return this.transform[13];
                },
                set(value) {
                    this.transform[13] = value;
                },
            },
            transformText: {
                get() {
                    return `matrix3d(${this.transform.join(", ")})`;
                },
            },
        });
    }
    Object.defineProperty(this, "rule", {
        get() {
            return `
width: ${this.width}px;
height: ${this.height}px;
margin-bottom: ${this.marginBottom}px;
margin-right: ${this.marginRight}px;
transform: ${this.matrix3d ? "matrix3d" : "matrix"}(${this.transform.join(", ")});
`;
        },
    });
    /**
     * Move the item by deltaX and deltaY.
     * @param {number} deltaX The x coordinate change.
     * @param {number} deltaY The y coordinate change.
     * @returns {void}
     */
    this.move = function (deltaX, deltaY) {
        this.x = this.x + deltaX;
        this.y = this.y + deltaY;
    };
}

export default function changeMap() {
    if (state.get("persist") === true) {
        store = new LocalStorageItem({
            key: "remarklet-changemap",
            type: "object",
            defaultValue: {},
        });
        if (store.restored) {
            for (const selector in store.value) {
                const stored = store.value[selector];
                const target = document.querySelector(selector);
                if (stored && target) {
                    stored.restored = true;
                    elementChangeMap.set(
                        target,
                        new ElementState(target, stored),
                    );
                    store.value[selector] = elementChangeMap.get(target);
                }
            }
        }
    }
}

changeMap.has = function (target) {
    return elementChangeMap.has(target);
};

changeMap.get = function (target) {
    return elementChangeMap.get(target);
};

changeMap.sync = function (target) {
    if (!store) {
        return;
    }
    const selector = getUniqueSelector(target, {
        excludeDataAttributePrefix: "remarklet",
    });
    store.value[selector] = elementChangeMap.get(target);
    store.store();
};

changeMap.each = function (callback) {
    for (const selector in store.value) {
        const elementState = store.value[selector];
        if (elementState) {
            callback(elementState);
        }
    }
};

changeMap.init = function (target, mode) {
    if (elementChangeMap.has(target)) {
        elementChangeMap.get(target)[mode] = true;
        return;
    }
    if (!store) {
        elementChangeMap.set(
            target,
            new ElementState(target, {
                [mode]: true,
            }),
        );
        return;
    }
    const selector = getUniqueSelector(target, {
        excludeDataAttributePrefix: "remarklet",
    });
    const previousSession = store.value[selector];
    if (!previousSession) {
        elementChangeMap.set(
            target,
            new ElementState(target, {
                selector,
                [mode]: true,
            }),
        );
        store.value[selector] = elementChangeMap.get(target);
        store.store();
        return;
    }

    elementChangeMap.set(
        target,
        new ElementState(target, {
            ...JSON.parse(JSON.stringify(previousSession)),
            restored: true,
            [mode]: true,
        }),
    );

    store.value[selector] = elementChangeMap.get(target);
    store.store();
};
