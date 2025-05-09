# Installation

## Module

Remarklet can be installed with:

- npm: `npm install @zw/remarklet`
- yarn: `yarn add @zw/remarklet`
- pnpm: `pnpm add @zw/remarklet`

Then import the module in your JavaScript file:

```javascript
import remarklet from "@zw/remarklet";
// Optional: configure the library.
remarklet.config({
    persist: true, // default: false.
    hide: true, // default: false.
});
// Restore changes from localStorage without activating the rest of the library.
remarklet.restore();
// Delete all Remarklet data from localStorage (cannot be undone).
remarklet.unstore();
// Initialize the library.
remarklet.activate();
// Deactivate the library.
remarklet.deactivate();
// Get the version of the library.
console.log(remarklet.version);
```

## CDN

Remarklet is available from:

- unpkg: `https://unpkg.com/@zw/remarklet/dist/remarklet.min.js`
- jsdelivr: `https://cdn.jsdelivr.net/npm/@zw/remarklet/dist/remarklet.min.js`

Add the following code to your HTML file:

```html
<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>
<script>
    // Configure the library.
    remarklet.config({
        persist: true, // default: false.
        hide: true, // default: false.
    });
    // Restore changes from localStorage without activating the rest of the library.
    remarklet.restore();
    // Delete all Remarklet data from localStorage (cannot be undone).
    remarklet.unstore();
    // Initialize the library.
    remarklet.activate();
    // Deactivate the library.
    remarklet.deactivate();
    // Get the version of the library.
    console.log(remarklet.version);
</script>
```
