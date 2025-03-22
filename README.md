# Remarklet - JavaScript web page editor

**Remarklet adds visual editing capabilities to any web page. This makes modifying and commenting on them remarkably easy, even on touchscreens! Check out the [CodePen demo.](https://codepen.io/zw/full/azbEBKp)**

[![CI](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml/badge.svg)](https://github.com/zachwatkins/remarklet/actions/workflows/ci.yml)
[![Npm package version](https://flat.badgen.net/npm/v/@zw/remarklet)](https://npmjs.com/package/@zw/remarklet)
![Npm package total downloads](https://flat.badgen.net/npm/dt/@zw/remarklet)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40zw%2Fremarklet%401.0.2)
![Npm package license](https://flat.badgen.net/npm/license/@zw/remarklet)
[![GitHub Repo stars](https://img.shields.io/github/stars/zachwatkins/remarklet)](https://github.com/zachwatkins/remarklet)

[![GitHub issues](https://img.shields.io/github/issues/ZachWatkins/remarklet.svg)](https://GitHub.com/ZachWatkins/remarklet/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/ZachWatkins/remarklet.svg)](https://GitHub.com/ZachWatkins/remarklet/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/Naereen/StrapDown.js.svg)](https://GitHub.com/ZachWatkins/remarklet/pull/)
[![GitHub pull-requests closed](https://img.shields.io/github/issues-pr-closed/ZachWatkins/remarklet.svg)](https://GitHub.com/ZachWatkins/remarklet/pull/)

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

You can also use the CDN to load the library directly in any website. Just open your browser's console and add the following code:

```javascript
const script = document.createElement("script");
script.src = "https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";
document.head.appendChild(script);
script.onload = () => remarklet.activate();
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
