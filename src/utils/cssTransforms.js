const elementTransforms = new Map();

/**
 * Store the original transform property of the target element.
 * @param {HTMLElement} element The target element.
 * @returns {string} The original transform property.
 */
function storeOriginalTransform(element) {
    if (!element || elementTransforms.has(element)) {
        return;
    }
    const computedTransform = window.getComputedStyle(element).transform;
    elementTransforms.set(element, computedTransform);
    return computedTransform;
}

/**
 * Resolve the target element's new transform properties based on the current
 * transform, the x and y coordinate changes, and the original transform
 * property.
 * @param {HTMLElement} target The target element being transformed.
 * @param {number} x The x coordinate change.
 * @param {number} y The y coordinate change.
 * target element.
 * @returns {{ x: number, y: number, style: string}} An object containing the
 * new x and y coordinates and the new transform style string.
 */
export function resolveTransform(target, x, y) {
    let style = "";
    const originalTransform =
        elementTransforms.get(target) || storeOriginalTransform(target);
    if ("none" === originalTransform) {
        style = `translate(${x}px, ${y}px)`;
    } else if (target.hasAttribute("data-remarklet-x")) {
        style = target.style.transform.replace(
            /translate\(([^)]+)\)/,
            `translate(${x}px, ${y}px)`,
        );
    } else {
        if (originalTransform.indexOf("matrix3d") === -1) {
            if (originalTransform.indexOf("matrix") === -1) {
                if (originalTransform.indexOf("translate") === -1) {
                    // No other positioning transforms.
                    style = originalTransform + ` translate(${x}px, ${y}px)`;
                } else {
                    // Pre-existing positioning transform.
                    // Get the original translation values.
                    const translateRegex = /\btranslate\(([^)]+)\)/;
                    const translateMatch =
                        originalTransform.match(translateRegex);
                    const translateValues = translateMatch
                        ? translateMatch[1].split(",")
                        : ["0px", "0px"];
                    // Determine the unit of the translation values.
                    const unitRegex = /[a-zA-Z%]+/;
                    const unitMatch = translateValues[0].match(unitRegex);
                    if (!unitMatch) {
                        // Invalid CSS unit, so ignore the original value.
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "px") {
                        // px unit, so it is safe to add the values.
                        x = parseFloat(translateValues[0]) + x;
                        y = parseFloat(translateValues[1]) + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "%") {
                        // % unit, so calculate the percentage of the element's width and height.
                        const width = target.offsetWidth;
                        const height = target.offsetHeight;
                        x = (parseFloat(translateValues[0]) / 100) * width + x;
                        y = (parseFloat(translateValues[1]) / 100) * height + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else if (unitMatch[0] === "em") {
                        // em unit, so calculate the percentage of the element's font size.
                        const fontSize = parseFloat(
                            window.getComputedStyle(target).fontSize,
                        );
                        x = parseFloat(translateValues[0]) * fontSize + x;
                        y = parseFloat(translateValues[1]) * fontSize + y;
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    } else {
                        // Unknown unit.
                        style = originalTransform.replace(
                            /translate\(([^)]+)\)/,
                            `translate(${x}px, ${y}px)`,
                        );
                    }
                }
            } else if (originalTransform.indexOf("translate") === -1) {
                // Put the translation at the beginning.
                style = `translate(${x}px, ${y}px) ` + originalTransform;
            } else {
                // Pre-existing positioning transform.
                // Get the original translation values.
                const translateRegex = /\btranslate\(([^)]+)\)/;
                const translateMatch = originalTransform.match(translateRegex);
                const translateValues = translateMatch
                    ? translateMatch[1].split(",")
                    : ["0px", "0px"];
                // Determine the unit of the translation values.
                const unitRegex = /[a-zA-Z%]+/;
                const unitMatch = translateValues[0].match(unitRegex);
                if (!unitMatch) {
                    // Invalid CSS unit, so ignore the original value.
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "px") {
                    // px unit, so we can safely add the values.
                    x = parseFloat(translateValues[0]) + x;
                    y = parseFloat(translateValues[1]) + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "%") {
                    // % unit, so we need to calculate the percentage of the element's width and height.
                    const width = target.offsetWidth;
                    const height = target.offsetHeight;
                    x = (parseFloat(translateValues[0]) / 100) * width + x;
                    y = (parseFloat(translateValues[1]) / 100) * height + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else if (unitMatch[0] === "em") {
                    // em unit, so we need to calculate the percentage of the element's font size.
                    const fontSize = parseFloat(
                        window.getComputedStyle(target).fontSize,
                    );
                    x = parseFloat(translateValues[0]) * fontSize + x;
                    y = parseFloat(translateValues[1]) * fontSize + y;
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                } else {
                    // Unknown unit, so we can't do anything.
                    style = originalTransform.replace(
                        /translate\(([^)]+)\)/,
                        `translate(${x}px, ${y}px)`,
                    );
                }
            }
        } else if (originalTransform.indexOf("translate") === -1) {
            // Put the translation at the beginning.
            style = `translate(${x}px, ${y}px) ` + originalTransfor;
        } else {
            // Pre-existing positioning transform.
            // Get the original translation values.
            const translateRegex = /\btranslate\(([^)]+)\)/;
            const translateMatch = originalTransform.match(translateRegex);
            const translateValues = translateMatch
                ? translateMatch[1].split(",")
                : ["0px", "0px"];
            // Determine the unit of the translation values.
            const unitRegex = /[a-zA-Z%]+/;
            const unitMatch = translateValues[0].match(unitRegex);
            if (!unitMatch) {
                // Invalid CSS unit, so ignore the original value.
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "px") {
                // px unit, so we can safely add the values.
                x = parseFloat(translateValues[0]) + x;
                y = parseFloat(translateValues[1]) + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "%") {
                // % unit, so we need to calculate the percentage of the element's width and height.
                const width = target.offsetWidth;
                const height = target.offsetHeight;
                x = (parseFloat(translateValues[0]) / 100) * width + x;
                y = (parseFloat(translateValues[1]) / 100) * height + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else if (unitMatch[0] === "em") {
                // em unit, so we need to calculate the percentage of the element's font size.
                const fontSize = parseFloat(
                    window.getComputedStyle(target).fontSize,
                );
                x = parseFloat(translateValues[0]) * fontSize + x;
                y = parseFloat(translateValues[1]) * fontSize + y;
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            } else {
                // Unknown unit, so we can't do anything.
                style = originalTransform.replace(
                    /translate\(([^)]+)\)/,
                    `translate(${x}px, ${y}px)`,
                );
            }
        }
    }
    return {
        x,
        y,
        style,
    };
}

/**
 * Detect whether the element uses a rotation transform CSS property.
 * @param {HTMLElement} target The target element
 * @return {boolean} True if the element uses a rotation transform CSS property
 */
export function hasRotation(target) {
    const transform = window.getComputedStyle(target).transform;
    if (transform === "none") {
        return false;
    }
    // Test for rotate, matrix, and matrix3d.
    const rotateRegex = /rotate\(([^)]+)\)/;
    const rotateMatch = transform.match(rotateRegex);
    if (rotateMatch) {
        return true;
    }
    const matrixRegex = /matrix\(([^)]+)\)/;
    const matrixMatch = transform.match(matrixRegex);
    if (matrixMatch) {
        const matrixValues = matrixMatch[1].split(",");
        const a = parseFloat(matrixValues[0]);
        const b = parseFloat(matrixValues[1]);
        if (Math.abs(a) !== 1 || Math.abs(b) !== 0) {
            return true;
        }
    }
    const matrix3dRegex = /matrix3d\(([^)]+)\)/;
    const matrix3dMatch = transform.match(matrix3dRegex);
    if (matrix3dMatch) {
        const matrix3dValues = matrix3dMatch[1].split(",");
        const a = parseFloat(matrix3dValues[0]);
        const b = parseFloat(matrix3dValues[1]);
        if (Math.abs(a) !== 1 || Math.abs(b) !== 0) {
            return true;
        }
    }
    return false;
}

export default {
    resolveTransform,
    hasRotation,
};
