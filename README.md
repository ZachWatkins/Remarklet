# Remarklet - JavaScript web page editor

**Remarklet adds visual editing tools to almost any web page. This makes modifying them remarkably easy, even on touchscreens! Check out the [CodePen demo.](https://codepen.io/zw/full/azbEBKp)**

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

[Features](#features) | [Installation](#installation) | [Bookmarklet](#bookmarklet) | [API](#api) | [Contributing](#contributing) | [Report an Issue](#report-an-issue) | [Feature Roadmap](https://github.com/ZachWatkins/Remarklet/discussions/98)

## Features

This library lets you add the following features to any web page:

- Drag and resize elements
- Hide anything
- Edit text
- Optionally save your changes to local storage using `remarklet.options({persist:true});`
- Restore persisted changes without loading editing controls using `remarklet.restore();`

## Installation

### Module

Remarklet can be installed with:

- npm: `npm install @zw/remarklet`
- yarn: `yarn add @zw/remarklet`
- pnpm: `pnpm add @zw/remarklet`

Then import the module in your JavaScript file:

```javascript
import remarklet from "@zw/remarklet";
// Optional: configure the library.
remarklet.configure({
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

### CDN

Remarklet is available from:

- unpkg: `https://unpkg.com/@zw/remarklet/dist/remarklet.min.js`
- jsdelivr: `https://cdn.jsdelivr.net/npm/@zw/remarklet/dist/remarklet.min.js`

Add the following code to your HTML file:

```html
<script src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js"></script>
<script>
    // Configure the library.
    remarklet.configure({
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

## Bookmarklet

To run Remarklet in any webpage, visit the webpage and then paste this into your browser's address bar:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();
```

You can use any public methods. For example, this version persists changes and allows elements to be hidden:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({persist:true,hide:true});remarklet.activate()}})();
```

You can save this as a custom bookmark in your browser, so you can activate the library on any webpage just by clicking the bookmark.

## API

This is the public API for the Remarklet library.

**remarklet** (function) - The interface which provides all public functionality for the library. Invoking `remarklet()` does nothing.

**remarklet.config** (function) - Configures library features.

- 

**remarklet.options** (deprecated, function) - Configures library features. Use `remarklet.config` instead.

**remarklet.activate** (function) - Activates the library for use.

**remarklet.deactivate** (function) - Deactivates the library and stops all functionalities.

**remarklet.restore** (function) - Restores persisted changes from local storage without activating other library features.

**remarklet.version** (function) - Returns the current version of the library.

## Contributing

Interested in contributing? Check out the [CONTRIBUTING.md](https://github.com/zachwatkins/remarklet/blob/main/CONTRIBUTING.md) file for guidelines.

If you would like to participate in discussions, you can post in the [GitHub Discussions](https://github.com/ZachWatkins/Remarklet/discussions) section of the repository.

Copyright 2014-2025 Zachary Kendall Watkins, <zwatkins.it@gmail.com>, https://zacharywatkins.com

## Report an Issue

We use GitHub to track [issues](https://github.com/ZachWatkins/Remarklet/issues) so if you find one please report it there. Some issues may be beyond the scope of this library to resolve and are documented in a GitHub Discussion here: https://github.com/ZachWatkins/Remarklet/discussions/100.
