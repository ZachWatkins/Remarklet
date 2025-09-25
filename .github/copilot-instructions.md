# Copilot Instructions for Remarklet

## Project Overview

**Remarklet** is a JavaScript library that adds visual editing tools to web pages, making it remarkably easy to modify content even on touchscreens. It provides drag-and-drop, resizing, text editing, and CSS manipulation capabilities for web elements.

### Key Features:

- Visual drag-and-drop editing of DOM elements
- Inline text editing with rich formatting
- Element resizing and positioning
- CSS style management and persistence
- Touch-friendly interface for mobile devices
- Bookmarklet functionality for use on any webpage

## Architecture & Source Code Organization

This is a JavaScript ES6 module library with TypeScript definitions.

**Main entry point:** `./index.js` - Exports the main Remarklet API
**Source code:** `./src/` directory contains modular components:

- `state.js` - Global state management
- `drag.js` - Drag and drop functionality
- `target.js` - Element targeting and selection
- `styles.js` - CSS manipulation and styling
- `textedit.js` - Inline text editing features
- `changeMap.js` - Change tracking and persistence
- `hide.js` - Element visibility controls
- `config.js` - Configuration management

**Other important directories:**

- `archived-library/` - Legacy version with features to migrate incrementally
- `demo/` - Demo application and test environment
- `dist/` - Built library files for distribution (generated)
- `tests/` - End-to-end Playwright tests
- `website/` - Documentation website (Docusaurus)

## Development Workflow

### Prerequisites

- Node.js >= 22.0.0 (specified in package.json engines)
- npm (comes with Node.js)

### Setup Commands

```bash
npm ci                 # Install dependencies
npm run build         # Build the library (rollup + TypeScript types)
npm run test          # Run Playwright end-to-end tests
npm run test:node     # Run Node.js unit tests
npm run lint          # Check code formatting with Prettier
npm run lint:fix      # Auto-fix formatting issues
npm run demo          # Start demo application
```

### Testing Strategy

- **E2E Tests:** Playwright tests in `tests/e2e/` for browser functionality
- **Unit Tests:** Node.js tests using built-in test runner for `src/**/*.spec.js`
- **Manual Testing:** Use `demo/` application to test library features
- Tests must pass before submitting pull requests

### Build Process

1. **Rollup** bundles the library into `dist/remarklet.min.js`
2. **TypeScript** generates type definitions in `dist/index.d.ts`
3. Built files are included in npm package for distribution

## Coding Style Guidelines

### Formatting

- **Indentation:** 4 spaces, no tabs (enforced by Prettier)
- **Line Length:** 80 characters maximum
- **End of Line:** LF (Unix style)

## Naming Conventions

- **Types:** PascalCase (`ElementTarget`, `DragState`)
- **Enums:** PascalCase values (`DRAG_MODE`, `TEXT_EDIT`)
- **Functions/Methods:** camelCase (`getTarget`, `startDrag`)
- **Properties/Variables:** camelCase (`isDragging`, `targetElement`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_CONFIG`, `EVENT_TYPES`)
- **Model Properties:** snake_case (`element_id`, `style_rules`)
- **File Names:** camelCase with descriptive names (`drag.js`, `textedit.js`)

## API Design Patterns

### Module Structure

Each module in `src/` should export a default object with:

- **State properties:** Current module state
- **Methods:** Public API functions
- **Event handlers:** Prefixed with `on` or `handle`

```javascript
// Example module pattern
export default {
    // State
    isActive: false,
    currentTarget: null,

    // Public methods
    activate() {
        /* ... */
    },
    deactivate() {
        /* ... */
    },

    // Event handlers
    onMouseDown(event) {
        /* ... */
    },
    handleTargetChange(target) {
        /* ... */
    },
};
```

### DOM Interaction Patterns

- Use modern DOM APIs (`querySelector`, `addEventListener`)
- Prefer event delegation for dynamic content
- Always check element existence before manipulation
- Use `data-*` attributes for Remarklet-specific metadata

### CSS Management

- Generate CSS programmatically rather than hardcoding strings
- Use CSS custom properties for dynamic values
- Namespace all Remarklet styles with `remarklet-` prefix
- Support CSS-in-JS patterns for dynamic styling

## Error Handling & Debugging

### Error Patterns

- Use descriptive error messages with context
- Log errors to console in development mode
- Gracefully degrade functionality when possible
- Validate inputs at module boundaries

```javascript
// ✅ Good error handling
function setTarget(element) {
    if (!element || !element.nodeType) {
        console.error("Remarklet: Invalid element provided to setTarget");
        return false;
    }
    // ... continue with valid element
}
```

### Debug Support

- Use `console.group()` for related log messages
- Include module name in debug output
- Respect debug/verbose configuration options

## Dependencies & External Libraries

### Current Dependencies

- **@interactjs/\*:** Core interaction handling (drag, resize, gestures)
- **Playwright:** End-to-end testing framework
- **Rollup:** Module bundling and minification
- **Prettier:** Code formatting

### Adding New Dependencies

- Prefer native browser APIs when possible
- Keep bundle size minimal for performance
- Consider tree-shaking support
- Evaluate compatibility with target browsers

## Testing Guidelines

### E2E Test Structure

```javascript
// tests/e2e/*.spec.js pattern
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
    test("should do specific behavior", async ({ page }) => {
        // Arrange: Set up test conditions
        await page.goto("/demo");

        // Act: Perform user actions
        await page.click('[data-test="activate-button"]');

        // Assert: Verify expected outcomes
        await expect(page.locator(".remarklet-active")).toBeVisible();
    });
});
```

### Unit Test Patterns

- Test pure functions in isolation
- Mock DOM interactions when needed
- Test error conditions and edge cases
- Use descriptive test names that explain expected behavior

## Performance Considerations

### DOM Performance

- Minimize DOM queries - cache references when possible
- Use `requestAnimationFrame` for smooth animations
- Batch DOM updates to avoid layout thrashing
- Remove event listeners on cleanup

### Memory Management

- Clean up references to DOM elements
- Remove event listeners when deactivating
- Avoid memory leaks in long-running applications

## Browser Compatibility

- **Target:** Modern browsers supporting ES6 modules
- **Mobile:** Touch-friendly interactions required
- **Fallbacks:** Graceful degradation for unsupported features
- **Testing:** Cross-browser validation with Playwright

## Documentation Standards

### JSDoc Comments

Use comprehensive JSDoc for all exported functions:

```javascript
/**
 * Activates drag functionality on the specified element.
 * @param {HTMLElement} element - The target element to make draggable
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.constrain=false] - Constrain movement to parent
 * @returns {boolean} True if activation successful, false otherwise
 * @throws {Error} When element is not a valid DOM node
 * @since 1.0.0
 */
function makeDraggable(element, options = {}) {
    // Implementation...
}
```

## Contributing Guidelines

- Follow existing code patterns and conventions
- Write tests for new features and bug fixes
- Update documentation for API changes
- Run `npm run lint:fix` before submitting
- Ensure all tests pass with `npm test`
- Reference issue numbers in commit messages

For detailed contribution process, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Troubleshooting Common Issues

### Build Failures

- **Node version:** Ensure Node.js >= 22.0.0
- **Dependencies:** Run `npm ci` to clean install
- **TypeScript errors:** Check `tsconfig.json` includes

### Test Failures

- **Browser missing:** Run Playwright install if needed
- **Timing issues:** Use proper `await` patterns in tests
- **Environment:** Ensure clean test state between runs

### Development Environment

- **Hot reload:** Use demo application for rapid testing
- **Debugging:** Use browser DevTools with unminified source
- **IDE setup:** Configure ESLint/Prettier extensions

### JavaScript/TypeScript Conventions

- **ES6 Modules:** Use `import`/`export` syntax
- **Arrow Functions:** Prefer `=>` over anonymous function expressions
- **Parameter Parentheses:** Only when necessary

    ```javascript
    // ✅ Correct
    x => x + x
    (x, y) => x + y
    <T>(x: T, y: T) => x === y

    // ❌ Incorrect
    (x) => x + x
    ```

- **Braces:** Always use for loops and conditionals, same line opening
- **Spacing:** No whitespace around parentheses, single space after commas/colons/semicolons

### Type Usage

- Use JSDoc comments for type information in JavaScript files
- TypeScript definitions are generated automatically
- Provide types for all function parameters and return values
- Export types/functions only when shared across components
- Avoid global namespace pollution

### String Conventions

- **Single quotes** for internal strings: `'internal'`
- **Double quotes** for user-facing strings: `"User message"`
- All user-visible strings should be externalized for localization
