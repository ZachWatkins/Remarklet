/**
 * Generates a unique CSS selector for a DOM element
 * @param {HTMLElement} element The target DOM element
 * @param {boolean} [optimized=true] Whether to generate an optimized selector
 * @returns {string} A unique CSS selector for the element
 */
export function getUniqueSelector(element, optimized = true) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    // Use id if available
    if (element.id) {
        return `#${CSS.escape(element.id)}`;
    }

    // Get element's tag name
    let tagName = element.tagName.toLowerCase();

    // If this is the root element, return the tag name
    if (element === document.documentElement) {
        return tagName;
    }

    // If optimized is false, use a full path approach
    if (!optimized) {
        let current = element;
        let result = [];

        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = tagName;

            // Add classes
            if (current.className && typeof current.className === "string") {
                selector +=
                    "." +
                    current.className
                        .trim()
                        .split(/\s+/)
                        .map(CSS.escape)
                        .join(".");
            }

            // Add nth-child
            let parent = current.parentNode;
            if (parent && parent.children.length > 1) {
                let index = 0;
                let similar = 0;

                for (let i = 0; i < parent.children.length; i++) {
                    let sibling = parent.children[i];
                    if (sibling === current) {
                        index = similar;
                        break;
                    }
                    if (sibling.tagName === current.tagName) {
                        similar++;
                    }
                }

                if (similar > 0) {
                    selector += `:nth-of-type(${index + 1})`;
                }
            }

            result.unshift(selector);

            if (current.id) {
                result.unshift(`#${CSS.escape(current.id)}`);
                break;
            }

            current = current.parentNode;
            tagName = current.tagName ? current.tagName.toLowerCase() : "";
        }

        return result.join(" > ");
    }

    // Optimized approach
    // Get sibling index
    let parentElement = element.parentElement;
    if (!parentElement) {
        return tagName;
    }

    // Try with classes first
    if (element.classList.length > 0) {
        let selector = tagName;
        for (let i = 0; i < element.classList.length; i++) {
            selector += `.${CSS.escape(element.classList[i])}`;
        }

        // Check if this selector is unique
        if (document.querySelectorAll(selector).length === 1) {
            return selector;
        }
    }

    // Try with attribute selectors
    for (const attr of element.attributes) {
        if (attr.name !== "class" && attr.name !== "style") {
            let selector = `${tagName}[${attr.name}="${CSS.escape(attr.value)}"]`;
            if (document.querySelectorAll(selector).length === 1) {
                return selector;
            }
        }
    }

    // Use nth-child as a last resort
    let siblings = Array.from(parentElement.children);
    let index = siblings.indexOf(element) + 1;

    // Get parent selector recursively
    let parentSelector = getUniqueSelector(parentElement, optimized);
    return `${parentSelector} > ${tagName}:nth-child(${index})`;
}

/**
 * Tests if a selector uniquely identifies an element
 * @param {string} selector The CSS selector to test
 * @param {HTMLElement} element The target element
 * @returns {boolean} Whether the selector uniquely identifies the element
 */
export function isUniqueSelector(selector, element) {
    const elements = document.querySelectorAll(selector);
    return elements.length === 1 && elements[0] === element;
}
