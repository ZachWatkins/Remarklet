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

[Features](#features) | [Installation](#installation) | [Installation from CDN](#installation-from-cdn) | [Contributing](#contributing) | [Feature Roadmap](#feature-roadmap)

## Features

This library lets you add the following features to any web page with no keyboard shortcuts or UI overlays:

- Drag elements around the page
- Resize elements
- Edit text
- Option to save your changes to local storage

## Installation

This package can be installed with:

- npm: `npm install @zw/remarklet`
- yarn: `yarn add @zw/remarklet`
- pnpm: `pnpm add @zw/remarklet`

Then import the module in your JavaScript file:

```javascript
import remarklet from "@zw/remarklet";
// Override default options for the library.
remarklet.options({
    persist: true, // default: false.
});
// Activate the library.
remarklet.activate();
// Now users can drag, resize, and edit elements on the page.
remarklet.deactivate();
// Now event handlers are unregistered and will be re-registered the next time remarklet.activate() is called.
```

## Installation from CDN

This library is available from:

- unpkg: `https://unpkg.com/@zw/remarklet/dist/remarklet.min.js`
- jsdelivr: `https://cdn.jsdelivr.net/npm/@zw/remarklet/dist/remarklet.min.js`

To run Remarklet in any webpage, visit the webpage and then paste this into your browser's address bar (it also works with jsdelivr):

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();
```

To persist the changes using local storage, use this bookmarklet URL:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({persist:true});remarklet.activate()}})();
```

You can save this as a custom bookmark in your browser, so you can activate the library on any webpage just by clicking it.

To use Remarklet in your own webpage, add the following code to your HTML file:

```html
<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>
<script>
    // Override default options for the library.
    remarklet.options({
        persist: true, // default: false.
    });
    // Activate the library.
    remarklet.activate();
    // Now users can drag, resize, and edit elements on the page.
    remarklet.deactivate();
    // Now event handlers are unregistered and will be re-registered the next time remarklet.activate() is called.
</script>
```

## Contributing

Interested in contributing? Check out the [CONTRIBUTING.md](https://github.com/zachwatkins/remarklet/blob/main/CONTRIBUTING.md) file for guidelines.

## Feature Roadmap

- Delete Elements
- Insert Notes
- Insert Images
- Insert Code
- View Grid
- Copy Elements
- Export the edited page as an HTML file

Copyright 2014-2025 Zachary Kendall Watkins, <zwatkins.it@gmail.com>, https://zacharywatkins.com
