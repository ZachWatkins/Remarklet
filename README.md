# Remarklet - JavaScript web page editor

[![CI](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml/badge.svg)](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@zw%2Fremarklet.svg)](https://www.npmjs.com/package/@zw/remarklet)
[![Downloads](https://img.shields.io/npm/dm/@zw%2Fremarklet.svg)](https://www.npmjs.com/package/@zw/remarklet)

**Remarklet adds visual editing capabilities to any web page. This makes modifying and commenting on them remarkably easy!**

[Demo available at CodePen](https://codepen.io/zw/pen/azbEBKp).

## Features

- Drag elements around the page
- Resize elements
- Edit text

## Installation

This package can be installed with:

- npm: `npm install @zw/remarklet`
- yarn: `yarn add @zw/remarklet`
- pnpm: `pnpm add @zw/remarklet`
- unpkg: `<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>`
- jsdelivr: `<script src="https://cdn.jsdelivr.net/npm/@zw/remarklet/dist/remarklet.min.js"></script>`

## Example

To use Remarklet, you need to import the module in your JavaScript file:

```javascript
import remarklet from "@zw/remarklet";
```

Then, you can activate or deactivate the features it provides:

```javascript
import remarklet from "@zw/remarklet";
remarklet.activate();
// Now users can drag, resize, and edit elements on the page.
remarklet.deactivate();
// Now event handlers are unregistered and will be re-registered the next time remarklet.activate() is called.
```

## CDN Example

```html
<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>
<script>
    remarklet.activate();
    // Now users can drag, resize, and edit elements on the page.
    remarklet.deactivate();
    // Now event handlers are unregistered and will be re-registered the next time remarklet.activate() is called.
</script>
```

## Feature Roadmap

- Insert Note
- Delete Elements
- View Grid
- Copy Elements
- Export the edited page as an HTML file
- Insert Image
- Insert Code
- Save
- Restore

Copyright 2025 Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
