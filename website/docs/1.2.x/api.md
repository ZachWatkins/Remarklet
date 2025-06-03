# API Reference

## remarklet() ⇒ <code>void</code> ⏏
The interface for the Remarklet library.

**Kind**: Exported function  

### remarklet.activate() ⇒ <code>void</code>
Activates the Remarklet library, initializing all necessary components.

**Kind**: static method of `remarklet`  
**Since**: 1.0.0  

### remarklet.deactivate() ⇒ <code>void</code>
Deactivates the Remarklet library, cleaning up any resources or event listeners. Note, to activate this method using an event listener, you need to use the `capture` option. See this issue for more details on that: [#149](https://github.com/ZachWatkins/Remarklet/issues/149).

**Kind**: static method of `remarklet`  
**Since**: 1.0.0  
**Example**

```javascript
document.body.addEventListener("click", function(e) {
    // Deactivate the library if the event target is the deactivate button.
    if ("deactivate" === e.target.id) {
        remarklet.deactivate();
    }
    // Ignore other clicked elements.
}, { capture: true });
remarklet.activate();
```

### remarklet.version : <code>string</code>
Get the current version of the Remarklet library.

**Kind**: static property of `remarklet`  
**Read only**: true  
**Since**: 1.0.2  

### remarklet.options(options) ⇒ <code>void</code>
Configures the library's features.

**Kind**: static method of `remarklet`  
**Since**: 1.1.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The configuration options. |
| options.persist | <code>boolean</code> | Whether to persist the state of the page between sessions. |
| options.hide | <code>boolean</code> | Whether to hide certain elements. |

### remarklet.restore() ⇒ <code>void</code>
Restores the persisted changes, if any. Runs before the interactive features are initialized.

**Kind**: static method of `remarklet`  
**Since**: 1.2.0  
