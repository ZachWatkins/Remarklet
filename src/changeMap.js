import state from "./state.js";
import { getUniqueSelector } from "./utils/cssSelector";
import LocalStorageItem from "./utils/LocalStorageItem";
const elementChangeMap = new WeakMap();
let store = null;

/**
 * @typedef {Object} ChangeMapItem
 * @property {boolean} restored - Whether the item has been restored.
 * @property {string} initialStyle - The initial style of the item.
 * @property {Object} delta - The delta of the item.
 * @property {number} delta.x - The x coordinate change.
 * @property {number} delta.y - The y coordinate change.
 * @property {number} delta.width - The width change.
 * @property {number} delta.height - The height change.
 * @property {boolean} dragged - Whether the item has been dragged.
 * @property {boolean} resized - Whether the item has been resized.
 * @property {string} selector - The selector of the item.
 * @property {Object} style - The style of the item.
 * @property {string} style.transform - The transform of the item.
 * @property {string} style.width - The width of the item.
 * @property {string} style.height - The height of the item.
 * @property {string} style.marginBottom - The margin bottom of the item.
 * @property {string} style.marginRight - The margin right of the item.
 * @property {() => string} getStyleRule - Returns the style rule for the item.
 * @property {(deltaX: number, deltaY: number) => void} move - Moves the item by deltaX and/or deltaY.
 */
/**
 * @constructor
 * @param {HTMLElement} target - The target element.
 * @param {Object} [props] - The properties of the change map item.
 * @param {boolean} [props.restored] - Whether the item has been restored.
 * @param {string} [props.initialStyle] - The initial style of the item.
 * @param {Object} [props.delta] - The delta of the item.
 * @param {number} [props.delta.x] - The x coordinate change.
 * @param {number} [props.delta.y] - The y coordinate change.
 * @param {number} [props.delta.width] - The width change.
 * @param {number} [props.delta.height] - The height change.
 * @param {boolean} [props.dragged] - Whether the item has been dragged.
 * @param {boolean} [props.resized] - Whether the item has been resized.
 * @param {string} [props.selector] - The selector of the item.
 * @param {Object} [props.style] - The style of the item.
 * @param {string} [props.style.transform] - The transform of the item.
 * @param {string} [props.style.width] - The width of the item.
 * @param {string} [props.style.height] - The height of the item.
 * @param {string} [props.style.marginBottom] - The margin bottom of the item.
 * @param {string} [props.style.marginRight] - The margin right of the item.
 */
function ChangeMapItem(target, props = {}) {
    this.restored = props.restored || false;
    this.initialStyle =
        props.initialStyle ||
        target.style.cssText.replace(/cursor:[^;]+;?/g, "");
    this.delta = props.delta || {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    this.dragged = props.dragged || false;
    this.resized = props.resized || false;
    this.selector =
        props.selector ||
        getUniqueSelector(target, {
            excludeDataAttributePrefix: "remarklet",
        });
    if (props.style) {
        this.style = { ...props.style };
    } else {
        this.style = {
            transform: target.style.transform || "none",
            width: target.style.width,
            height: target.style.height,
            cursor: target.style.cursor,
        };
    }
    // If the item is restored, we need to
    this.getStyleRule = function () {
        const styles = this.style;
        let rule = [];
        for (const key in styles) {
            if (styles[key] === null) {
                continue;
            }
            const kebabKey = key.replace(
                /([A-Z])/g,
                (match) => `-${match.toLowerCase()}`,
            );
            rule.push(`${kebabKey}: ${styles[key]}`);
        }
        if (rule.length === 0) {
            return "";
        }
        return rule.join(";\n") + ";";
    };
    /**
     * Move the item by deltaX and/or deltaY, updating the change item's
     * style.transform, delta.x, and delta.y properties.
     * @param {number} deltaX The x coordinate change.
     * @param {number} deltaY The y coordinate change.
     * @returns {void}
     */
    this.move = function (deltaX, deltaY) {
        this.delta.x += deltaX;
        this.delta.y += deltaY;
        let style = "";
        const originalTransform =
            elementTransforms.get(target) || storeOriginalTransform(target);
        if ("none" === this.style.transform) {
            style = `matrix(1, 0, 0, 1, ${x}, ${y})`;
        } else if (originalTransform.indexOf("matrix(") >= 0) {
            const matrixRegex = /matrix\(([^)]+)\)/;
            const matrixMatch = originalTransform.match(matrixRegex);
            let vals = [1, 0, 0, 1, 0, 0];
            if (matrixMatch) {
                vals = matrixMatch[1].split(",").map((v) => parseFloat(v));
            }
            const a = parseFloat(vals[0]);
            const b = parseFloat(vals[1]);
            const c = parseFloat(vals[2]);
            const d = parseFloat(vals[3]);
            const e = parseFloat(vals[4]);
            const f = parseFloat(vals[5]);
            // Calculate the new translation values.
            x = e + x;
            y = f + y;
            // Create the new matrix string.
            style = `matrix(${a}, ${b}, ${c}, ${d}, ${x}, ${y})`;
        } else {
            const matrix3dRegex = /matrix3d\(([^)]+)\)/;
            const matrix3dMatch = originalTransform.match(matrix3dRegex);
            let vals = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            if (matrix3dMatch) {
                vals = matrix3dMatch[1].split(",").map((v) => parseFloat(v));
            }
            x = vals[12] = vals[0] * x + vals[4] * y + vals[12];
            y = vals[13] = vals[1] * x + vals[5] * y + vals[13];
            style = "matrix3d(" + vals.join(", ") + ")";
        }
        return {
            x,
            y,
            style,
        };
    };
}

export default function changeMap() {
    if (state.get("persist") === true) {
        store = new LocalStorageItem({
            key: "remarklet-changemap",
            type: "object",
            defaultValue: {},
        });
    }
}

changeMap.has = function (target) {
    return elementChangeMap.has(target);
};

changeMap.get = function (target) {
    return elementChangeMap.get(target);
};

changeMap.set = function (target, value) {
    elementChangeMap.set(target, value);
    if (store) {
        const selector = getUniqueSelector(target, {
            excludeDataAttributePrefix: "remarklet",
        });
        store.value[selector] = value;
        store.store();
    }
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

changeMap.init = function (target, mode) {
    if (elementChangeMap.has(target)) {
        return;
    }
    const selector = getUniqueSelector(target, {
        excludeDataAttributePrefix: "remarklet",
    });
    if (!store) {
        elementChangeMap.set(
            target,
            new ChangeMapItem(target, {
                selector,
                [mode]: true,
            }),
        );
        return;
    }
    const previousSession = store.value[selector];
    if (!previousSession) {
        elementChangeMap.set(
            target,
            new ChangeMapItem(target, {
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
        new ChangeMapItem(target, {
            ...JSON.parse(JSON.stringify(previousSession)),
            restored: true,
            [mode]: true,
        }),
    );
    store.value[selector] = elementChangeMap.get(target);
    store.store();
};
