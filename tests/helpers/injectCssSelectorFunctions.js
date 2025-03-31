// filepath: c:\Users\watki\repositories\remarklet\tests\helpers\injectCssSelectorFunctions.js
/**
 * Helper to inject the cssSelector functions into the browser context
 * @param {import('@playwright/test').Page} page The Playwright page instance
 */
export async function injectCssSelectorFunctions(page) {
    await page.addScriptTag({
        content: `
            window.getUniqueSelector = function(
                element,
                options,
            ) {
                if (!element || element.nodeType !== Node.ELEMENT_NODE) {
                    return "";
                }
                const optimized =
                    options && typeof options.optimized === "boolean"
                        ? options.optimized
                        : true;
                const excludeDataAttributePrefix =
                    options && options.excludeDataAttributePrefix
                        ? options.excludeDataAttributePrefix
                        : null;

                // Skip html and body elements
                if (element === document.documentElement || element === document.body) {
                    return "";
                }

                // Use id if available
                if (element.id) {
                    return \`#\${CSS.escape(element.id)}\`;
                }

                // Get element's tag name
                let tagName = element.tagName.toLowerCase();

                // If optimized is false, use a full path approach
                if (!optimized) {
                    let current = element;
                    let result = [];
                    let idFound = false;

                    while (current && current.nodeType === Node.ELEMENT_NODE) {
                        // Skip html and body tags
                        if (
                            current === document.documentElement ||
                            current === document.body
                        ) {
                            current = current.parentNode;
                            tagName = current?.tagName ? current.tagName.toLowerCase() : "";
                            continue;
                        }

                        // If we found an element with an ID, we can stop building the path
                        // and just use the ID as the base
                        if (current.id) {
                            result = [\`#\${CSS.escape(current.id)}\`];
                            idFound = true;
                            break;
                        }

                        let selector = current.tagName.toLowerCase();

                        // Add classes
                        if (current.className && typeof current.className === "string") {
                            selector +=
                                "." +
                                current.className
                                    .trim()
                                    .split(/\\s+/)
                                    .map(CSS.escape)
                                    .join(".");
                        }

                        // Add nth-child for elements with siblings of the same type
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
                                selector += \`:nth-of-type(\${index + 1})\`;
                            }
                        }

                        result.unshift(selector);
                        current = current.parentNode;
                        tagName = current?.tagName ? current.tagName.toLowerCase() : "";
                    }

                    // If we're dealing with an element inside an element with ID,
                    // we need to handle the case specifically for elements with nth-child
                    if (idFound && element !== document.querySelector(result[0])) {
                        // Find position of the element among siblings of the same tag
                        const parentWithId = document.querySelector(result[0]);
                        if (parentWithId) {
                            const targetTag = element.tagName.toLowerCase();
                            const siblings = Array.from(parentWithId.querySelectorAll(targetTag));
                            const position = siblings.indexOf(element) + 1;

                            if (position > 0) {
                                return \`\${result[0]} > \${targetTag}:nth-child(\${position})\`;
                            }
                        }
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
                        selector += \`.\${CSS.escape(element.classList[i])}\`;
                    }

                    // Check if this selector is unique
                    if (document.querySelectorAll(selector).length === 1) {
                        return selector;
                    }
                }

                // Try with attribute selectors
                for (const attr of element.attributes) {
                    if (
                        attr.name !== "class" &&
                        attr.name !== "style" &&
                        (!excludeDataAttributePrefix ||
                            !attr.name.startsWith("data-" + excludeDataAttributePrefix))
                    ) {
                        let selector = \`\${tagName}[\${attr.name}="\${CSS.escape(attr.value)}"]\`;
                        if (document.querySelectorAll(selector).length === 1) {
                            return selector;
                        }
                    }
                }

                // Use nth-child as a last resort
                let siblings = Array.from(parentElement.children);
                let index = siblings.indexOf(element) + 1;

                // Skip if parent is html or body
                if (
                    parentElement === document.documentElement ||
                    parentElement === document.body
                ) {
                    return \`\${tagName}:nth-child(\${index})\`;
                }

                // Get parent selector recursively
                let parentSelector = getUniqueSelector(parentElement, options);

                // If parent selector is empty (which happens when parent is or contains html/body),
                // return just this element's selector
                if (!parentSelector) {
                    return \`\${tagName}:nth-child(\${index})\`;
                }

                return \`\${parentSelector} > \${tagName}:nth-child(\${index})\`;
            };

            /**
             * Tests if a selector uniquely identifies an element
             * @param {string} selector The CSS selector to test
             * @param {HTMLElement} element The target element
             * @returns {boolean} Whether the selector uniquely identifies the element
             */
            window.isUniqueSelector = function(selector, element) {
                const elements = document.querySelectorAll(selector);
                return elements.length === 1 && elements[0] === element;
            };
        `,
    });
}
