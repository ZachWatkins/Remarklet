# Bookmarklet

## What is a Bookmarklet?

A bookmarklet is a small JavaScript program stored as a URL within a bookmark in a web browser. It allows you to execute custom scripts on any web page you visit, enabling quick and easy access to functionality without needing to install browser extensions or modify the page's source code.

## Instructions

To run Remarklet in any web page, visit the web page and then paste this into your browser's address bar:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();
```

To activate optional features, use the following code instead:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({persist:true,hide:true});remarklet.activate()}})();
```

It's easiest to save this as a custom bookmark in your browser and click it instead of pasting the code every time. Here's how to do it:

1. Create a new bookmark in your browser.
2. Set the bookmark's name to "Remarklet".
3. Set the bookmark's URL to the code above.
4. Save the bookmark.
