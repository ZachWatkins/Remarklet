/**
 * Resolve the target element's new transform properties based on the current
 * transform, the x and y coordinate changes, and the original transform
 * property.
 * @param {HTMLElement} target The target element being transformed.
 * @param {number} x The x coordinate change.
 * @param {number} y The y coordinate change.
 * @param {string} originalTransform The original transform property of the
 * target element.
 * @returns {{ x: number, y: number, style: string}} An object containing the
 * new x and y coordinates and the new transform style string.
 */
export default function resolveTransform(target, x, y, originalTransform) {
    let style = "";
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
