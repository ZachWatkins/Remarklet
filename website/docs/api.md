<a name="module_@zw/remarklet"></a>

## @zw/remarklet
Remarklet is a library for visually manipulating web page content.

**Author**: Zachary Kendall Watkins  
**License**: Licensed under the MIT License. See LICENSE.txt in the project root or go to
https://github.com/ZachWatkins/Remarklet/blob/main/LICENSE.txt for
full license information.  
**Copyright**: 2014-present Zachary Kendall Watkins. All rights reserved.  

* [@zw/remarklet](#module_@zw/remarklet)
    * [remarklet()](#exp_module_@zw/remarklet--remarklet) ⇒ <code>void</code> ⏏
        * [.version](#module_@zw/remarklet--remarklet.version) : <code>string</code>
        * [.config(options)](#module_@zw/remarklet--remarklet.config) ⇒ <code>void</code>
        * ~~[.options(options)](#module_@zw/remarklet--remarklet.options) ⇒ <code>void</code>~~
        * [.restore()](#module_@zw/remarklet--remarklet.restore) ⇒ <code>void</code>
        * [.unstore()](#module_@zw/remarklet--remarklet.unstore) ⇒ <code>void</code>
        * [.activate()](#module_@zw/remarklet--remarklet.activate) ⇒ <code>void</code>
        * [.deactivate()](#module_@zw/remarklet--remarklet.deactivate) ⇒ <code>void</code>

<a name="exp_module_@zw/remarklet--remarklet"></a>

### remarklet() ⇒ <code>void</code> ⏏
**Kind**: Exported function  
<a name="module_@zw/remarklet--remarklet.version"></a>

#### remarklet.version : <code>string</code>
Get the current version of the Remarklet library.

**Kind**: static property of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Read only**: true  
**Since**: 1.0.2  
<a name="module_@zw/remarklet--remarklet.config"></a>

#### remarklet.config(options) ⇒ <code>void</code>
Configures the library's features.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.3.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The configuration options. |
| options.persist | <code>boolean</code> | Whether to persist the state of the page between sessions. |
| options.hide | <code>boolean</code> | Whether to hide certain elements. |

<a name="module_@zw/remarklet--remarklet.options"></a>

#### ~~remarklet.options(options) ⇒ <code>void</code>~~
***Deprecated***

Deprecated. An alias of remarklet.config. Will be removed in v2.0.0.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.1.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The configuration options. |
| options.persist | <code>boolean</code> | Whether to persist the state of the page between sessions. |
| options.hide | <code>boolean</code> | Whether to hide certain elements. |

<a name="module_@zw/remarklet--remarklet.restore"></a>

#### remarklet.restore() ⇒ <code>void</code>
Restores the persisted changes, if any. Runs before the interactive features are initialized.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.2.0  
<a name="module_@zw/remarklet--remarklet.unstore"></a>

#### remarklet.unstore() ⇒ <code>void</code>
Deletes all Remarklet data from localStorage.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.3.0  
<a name="module_@zw/remarklet--remarklet.activate"></a>

#### remarklet.activate() ⇒ <code>void</code>
Activates the Remarklet library, initializing all necessary components.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.0.0  
<a name="module_@zw/remarklet--remarklet.deactivate"></a>

#### remarklet.deactivate() ⇒ <code>void</code>
Deactivates the Remarklet library, cleaning up any resources or event listeners.

**Kind**: static method of [<code>remarklet</code>](#exp_module_@zw/remarklet--remarklet)  
**Since**: 1.0.0  
