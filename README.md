# Remarklet - JavaScript web page editor

[![CI](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml/badge.svg)](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dm/@zw%2Fremarklet.svg)](https://www.npmjs.com/package/@zw/remarklet)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40zw%2Fremarklet%401.0.2)
[![GitHub Repo stars](https://img.shields.io/github/stars/zachwatkins/remarklet)](https://github.com/zachwatkins/remarklet)

**Remarklet adds visual editing capabilities to any web page. This makes modifying and commenting on them remarkably easy!**

[Check out the CodePen demo](https://codepen.io/zw/full/azbEBKp).

## Features

This library lets you add the following features to any web page with no keyboard shortcuts or UI overlays:

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

## Contributing

Interested in contributing? Check out the [CONTRIBUTING.md](https://github.com/zachwatkins/remarklet/blob/main/CONTRIBUTING.md) file for guidelines.

Copyright 2014-2025 Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://zacharywatkins.com)
