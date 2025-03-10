# Remarklet - JavaScript web page editor controls

**Remarklet adds visual editing capabilities to any web page. This makes modifying and commenting on them remarkably easy!**

## Features

-   Drag elements around the page
-   Resize elements
-   Edit text

## Installation

This package can be installed with npm:

```shell
npm install @zw/remarklet
```

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

## Feature Roadmap

-   Insert Note
-   Delete Elements
-   View Grid
-   Copy Elements
-   Export the edited page as an HTML file
-   Insert Image
-   Insert Code
-   Save
-   Restore

Copyright 2025 Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
