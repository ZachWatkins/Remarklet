# Bookmarklet

To run Remarklet in any web page, visit the web page and then paste this into your browser's address bar:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.activate()}})();
```

You can use any public methods. For example, this version persists changes and allows elements to be hidden:

```
javascript:(function(){const script=document.createElement("script");script.src="https://unpkg.com/@zw/remarklet/dist/remarklet.min.js";document.head.appendChild(script);script.onload=()=>{remarklet.options({persist:true,hide:true});remarklet.activate()}})();
```

You can save this as a custom bookmark in your browser, so you can activate the library on any web page just by clicking the bookmark.
