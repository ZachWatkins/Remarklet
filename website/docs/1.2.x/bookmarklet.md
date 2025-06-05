# Bookmarklet

The term "bookmarklet" is not used often. It is an important browser feature used by Remarklet to allow users to run it on any web page. I have plans to develop a browser extension, but for now, the bookmarklet is the easiest way to use it on any web page.

## What is a Bookmarklet?

A bookmarklet is like a browser extension. It's a program stored as a URL in a web browser that can be executed by clicking a link or a bookmark. This allows you to execute custom scripts on any web page by visiting it and then clicking the bookmark.

## How do I add a Bookmarklet?

To add a bookmarklet, you need to create a new bookmark in your browser and set its URL to a specific JavaScript code snippet. This code snippet will load the Remarklet script and activate it on the current web page.

```
javascript:(function(){let script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();
```

To activate optional features, use the following code instead:

```
javascript:(function(){let script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({persist:true,hide:true});remarklet.activate()}})();
```

It's easiest to save this as a custom bookmark in your browser and click it instead of pasting the code every time. Here's how to do it:

1. Create a new bookmark in your browser.
2. Set the bookmark's name to "Remarklet".
3. Set the bookmark's URL to the code above.
4. Save the bookmark.

## Additional References

https://en.wikipedia.org/wiki/Bookmarklet

https://www.freecodecamp.org/news/what-are-bookmarklets/
