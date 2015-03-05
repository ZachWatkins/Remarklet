/* Remarklet - v0.9 - 2014-11-21
 by Zach Watkins (zwatkins7@yahoo.com)
 https://remarklet.com
 licensed under the MIT License.
*/
requirejs.config({
	paths: {
		'jquery': 'jquery-2.1.3.min',
		'jqueryui': 'jquery-ui.min'
	},
	shim: {
		'rangyinputs-jquery': ['jquery']
	}
});
requirejs(['jquery', 'jqueryui', 'rangyinputs-jquery'], function($){
	/* Stored Object module. */
	var storedObject = (function(){
		var dbname, def, dataset = {};
		var set = function(name, data){
			if(data){
				dataset[name] = data;
			} else if(typeof name == 'object'){
				dataset = name;
			}
			localStorage[dbname] = JSON.stringify(dataset);
			return this; 
		};
		return {
			init: function(uniquename, defs){
				var name, storage;
				dbname = uniquename;
			    dataset = Object.create(defs);
			    def = Object.create(defs);
			    if(localStorage[dbname] !== undefined){
				    storage = JSON.parse(localStorage[dbname]);
				    for(name in storage){
					    dataset[name] = storage[name];
				    }
			    }
			    return this;
			},
			get: function(name){
			    if(name){
				    return dataset[name];
			    } else {
				    return dataset;
			    }
			},
			set: set,
			reset: function(){
			    set(def);
			    localStorage.removeItem(dbname);
			    return this;
			}
		};
	}());
	/* Stylesheet Module */
	var stylesheet = (function(){
		var style, indent, rules = {},
			rulesToString = function(){
				var css = '',
					name;
				for(name in rules){
					css += name;
					css += ' ';
					css += rules[name];
					css += '\n';
				}
				css.replace(/\n$/,'');
				return css;
			},
			setString = function(str){
				if(style.textContent != str){
					var t, arr = str.split('}').slice(0,-1);
					rules = {};
					for(var i=0, len=arr.length; i<len; i++){
						t = arr[i].split('{');
						rules[t[0].trim()] = '{' + t[1] + '}';
					}
					style.textContent = str;
				}
			};
		return {
			init: function(args){
				style = args.element;
				indent = args.indent;
			},
			setRule: function(selector, rule){
				if(!rule) return;
				var ruletext, found = false,
					i = style.sheet.cssRules.length-1;
				ruletext = '{\n' + indent + rule.replace(/; (\w)/g, ';\n'+indent+'$1') + '\n}';
				while(i >= 0){
					if(selector == style.sheet.cssRules[i].selectorText){
						found = style.sheet.cssRules[i];
						i = 0;
					}
					i--;
				}
				if(!found){
					style.sheet.insertRule(selector + ruletext, style.sheet.cssRules.length);
				} else {
					var inline, existing, len, j, a = {};
					inline = rule.replace(/(:|;)\s/g,'$1').split(';');
					inline.pop();
					existing = found.style.cssText.replace(/(:|;)\s/g,'$1').split(';');
					existing.pop();
					for(i=0, len = inline.length; i < len; i++){
						j = inline[i].split(':');
						a[j[0]] = j[1];
					}
					for(i=0, len = existing.length; i < len; i++){
						j = existing[i].split(':');
						if(a.hasOwnProperty(j[0])){
							existing[i] = j[0]+':'+a[j[0]];
							delete a[j[0]];
						}
					}
					for(i in a){
						existing.push(i+':'+a[i]);
					}
					existing = existing.join(';').replace(/(:|;)/g,'$1 ').replace(/\s$/,'')+';';
					found.style.cssText = existing;
					existing = '{\n' + indent + existing.replace(/; /g,';\n' + indent) + '\n}';
					ruletext = existing;
				}
				rules[selector] = ruletext;
				style.textContent = rulesToString();
			},
			setString: setString,
			getRules: function(){
				return rules;
			},
			getString: function(){
				return style.textContent;
			}
		};
	}());
	/* Element Duplication Module. Dependency: stylesheet.setRule */
	var duplicate = (function(){
		var rules = {},
			rulelength = 0,
			stylesheet;
		var getSelector = function(el){
			var value = el.tagName.toLowerCase();
			if(el.id !== ''){
				value += '#';
				value += el.id;
			}
			if(el.className !== ''){
				value += '.';
				value += el.className.replace(/\s+/g,'.');
			}
			return value;
		};
		var getSelectorsBetween = function(start, end){
			var parent = end.parentNode,
				limit = start.parentNode,
				value = getSelector(end),
				temp;
			while(parent != limit){
				temp = value;
				value = getSelector(parent);
				value += ' ';
				value += temp;
				parent = parent.parentNode;
			}
			return value;
		};
		var getUniqueStyles = function(sel, destination, clone){
			sel = sel.split(':');
			var selector = sel[0],
				pseudoselector = sel.length > 1 ? ':' + sel[1] : null,
				el = document.querySelector(selector),
				elstyle = window.getComputedStyle(el, pseudoselector),
				parentstyle = window.getComputedStyle(el.parentNode, null),
				clonestyle = window.getComputedStyle(clone, pseudoselector),
				values = '',
				flag, attribute, value;
			if(pseudoselector){
				if(elstyle.content == clonestyle.content && elstyle.content == 'none'){
					return;
				} else {
					clonestyle = window.getComputedStyle(el, null);
					values += 'content: ';
					values += elstyle.content;
					values += ';';
				}
			}
			for(var i=0, len=elstyle.length; i<len; i++){
				flag = false;
				attribute = elstyle[i];
				value = elstyle.getPropertyValue(attribute);
				if(value != clonestyle.getPropertyValue(attribute)){
					switch(attribute){
						case 'outline-color':
						case '-webkit-text-emphasis-color':
						case '-webkit-text-fill-color':
						case '-webkit-text-stroke-color':
						case '-moz-text-decoration-color':
						case '-webkit-text-decoration-color':
							if(value == elstyle.color){
								flag = true;
							}
							break;
						case 'border-bottom-color':
						case 'border-left-color':
						case 'border-right-color':
						case 'border-top-color':
							if(elstyle.borderWidth === '' || elstyle.borderWidth == '0px'){
								flag = true;
							}
							break;
						case '-moz-column-rule-color':
						case '-webkit-column-rule-color':
							if(elstyle.getPropertyValue(attribute.replace('color','width')) == '0px'){
								flag = true;
							}
							break;
						case '-moz-text-decoration-line':
						case '-webkit-text-decoration-line':
							if(value == elstyle.textDecoration){
								flag = true;
							}
							break;
						case '-moz-column-gap':
						case '-webkit-column-gap':
							if(elstyle.getPropertyValue(attribute.replace('gap','count')) == 'auto' && elstyle.getPropertyValue(attribute.replace('gap','width')) == 'auto'){
								flag = true;
							}
							break;
						case 'transform-origin':
						case 'perspective-origin':
							if(elstyle.getPropertyValue(attribute.replace('-origin','')) == 'none'){
								flag = true;
							}
							break;
						case '-webkit-text-decorations-in-effect':
							flag = true;
							break;
						case 'content':
							flag = true;
							break;
						default:
							break;
					}
					if(!flag && (parentstyle.getPropertyValue(attribute) != value || clonestyle.getPropertyValue(attribute) != value)){
						values += attribute;
						values += ':';
						values += value;
						values += ';';
					}
				}
			}
			return values;
		};
		var addRule;
		return {
			init: function(stylesheetModule){
				addRule = stylesheetModule.setRule;
			},
			setSheet: function(obj){
				stylesheet = obj;
			},
			create: function(sel, destination, attrs){
				var target = typeof sel == 'string' ? document.querySelector(sel) : sel,
					selectors = [],
					children = target.querySelectorAll('*'),
					clone = target.cloneNode(true),
					len = children.length,
					tsel, csel, cloneselector;
				if(attrs){
					if(attrs.id) clone.id = attrs.id;
					if(attrs.class) clone.className = attrs.class;
				}
				cloneselector = getSelector(clone);

				if(typeof destination == 'string'){
					document.querySelector(destination).appendChild(clone);
				} else {
					if(destination.nextSibling){
						destination.parentNode.insertBefore(clone, destination.nextSibling);
					} else {
						destination.parentNode.appendChild(clone);
					}
				}

				selectors.push(getSelector(target));

				for(var i=0; i<len; i++){
					selectors.push(getSelectorsBetween(target, children[i]));
				}
				len = selectors.length;
				for(var j=0; j<len; j++){
					tsel = selectors[j];
					csel = cloneselector + selectors[j].replace(selectors[0], '');
					if(rules[csel] === undefined){
						addRule(csel, getUniqueStyles(tsel, destination, clone));
						addRule(csel+':before', getUniqueStyles(tsel+':before', destination, clone));
						addRule(csel+':after', getUniqueStyles(tsel+':after', destination, clone));
					}
				}
				return clone;
			}
		};
	}());
	/* Prompt Window Module. Dependency: jQuery */
	var prompt = (function(){
		var callback, formobj;
		var open = function(args){
			if(ui.window.css('display') === 'block'){
				close();
			}
			if(typeof args.form == 'string'){
				ui.form.html(args.form);
			} else {
				formobj = args.form;
				ui.form.append(args.form);
			}
			args.init();
			ui.window.show();
			ui.content.css({'margin-top':function(){
				return -1 * (ui.content.innerHeight()/2);
			}});
			ui.form.find('input,textarea').first().focus();
			callback = args.callback;
		};
		var submit = function(){
			var data = {};
			ui.form.find('*[name]').each(function(){
				data[this.name] = this.value;
			});
			callback(data);
			close();
		};
		var close = function(){
			ui.window.focus().blur().hide();
			if(formobj){
				formobj.remove();
			}
			ui.form.html('');
		};
		var ui = {
			window: $('<div></div>').on('keydown', keydown),
			form: $('<div></div>'),
			content: $('<div></div>'),
			submit: $('<button type="button">Submit</button>').on('click', submit),
			cancel: $('<button type="button">Cancel</button>').on('click', close)
		};
		var keydown = function(e){
			e.stopPropagation();
			if(e.keyCode == 27){
				/* Escape => Cancel form */
				e.preventDefault();
				close();
			}
		};
		return {
			init: function(prefix){
				var key;
				for(key in ui){
					ui[key].attr('id', prefix+'-prompt-'+key);
				}
				ui.content.append(ui.form).append(ui.submit).append(ui.cancel).appendTo(ui.window);
				ui.window.appendTo('body');
			},
			get: {
				window: function(){
					return ui.window;
				},
				form: function(){
					return ui.form;
				},
				submit: function(){
					return ui.submit;
				}
			},
			open: open
		};
	}());
	var _getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) || (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) || window.createObjectURL;
	var $w = $(window);
	var $b = $('body');
	var remarklet = {};
	var _target;
	var _texttarget = false;
	var _mode = 'drag';
	var _dragging = false;
	var _typingTimer = false;
	var _stored = {
		clipboard: null,
		pageSavedState: '',
		fileRead: false,
		editcounter: 0
	};
	var menu = {
		File: {Export: 1, Save: 1, Restore: 1},
		View: {Grid: 1, Outlines: 1, CSS: 1},
		Insert: {Image: 1, Note: 1, HTML: 1},
		Help: 1
		/* Edit */
	};
	var preferences = {
		Grid: {
			'Size': '100px',
			'Division': 5,
			'Background': 'transparent',
			'Lines': '#fff'
		},
		CSS_Editor: {
			Indentation: '    ',
			'Font Size': '12pt',
			'Update': 500
		},
		Export: {
			'Disable Javascript': true,
			'Show Browser Info': false,
			'Require Absolute URLs': true
		}
	};
	var views = {
		menuwrapper: $('<div id="remarklet-menu"></div>'),
		csswindow: $('<div id="remarklet-ui-usercss" class="remarklet-dont-edit"></div>'),
		csstextarea: $('<textarea name="remarklet-usercss-editor" id="remarklet-usercss-editor" class="emmet emmet-syntax-css"></textarea>'),
		newimageform: $('<label>Make a placeholder</label><input type="text" value="300x200" id="remarklet-imgdimensions" name="imgdimensions" autofocus="autofocus"> <input type="text" value="#cccccc" id="remarklet-bgcolor" name="bgcolor"> <input type="text" value="#000000" id="remarklet-textcolor" name="textcolor"> <input type="text" value="Image (300x200)" id="remarklet-text" name="imgtext"><br /><label>Enter image url</label><input name="imgurl" id="remarklet-url" type="text" value="http://placehold.it/">'),
		newnoteform: $('<label>Enter note text</label><textarea name="notetext" id="remarklet-text" type="text" autofocus="autofocus" cols="48" rows="13">Enter your note\'s text here.</textarea>'),
		newhtmlform: $('<label>Enter HTML</label><textarea name="remarkletinserthtml" id="remarklet-text" class="emmet emmet-syntax-html" type="text" autofocus="autofocus" cols="48" rows="13">Enter your code here.</textarea>'),
		/*preferences: $('<div id="remarklet-ui-preferences" class="remarklet-dont-resize remarklet-dont-edit"></div>'),*/
		help: $('<div id="remarklet-ui-help"><div>Helpful Hints For Using <a target="_blank" onclick="event.stopPropagation();" href="https://remarklet.com">Remarklet</a><div><p>Thanks for using this bookmarklet! Here are some tips to help you get the most out of it:</p><p>Drag elements around with your mouse by holding down the left mouse button while your cursor is hovered over an element and then moving it around. The new position of the element is added to the User CSS stylesheet, which you can access directly from the menu under View => CSS. This CSS editor is equipped with some shortcuts of its own, similar to Emmet. Hold the ctrl key and press the up or down arrows while your cursor is near a number to increase or decrease that number by 1. Press the tab key immediately after writing a CSS property to insert ": " and get to writing the value a little quicker.</p><div>Drag Mode Shortcuts<ol><li>Text Mode: <span title="T key" class="key">T</span></li><li>Drag Mode: <span title="V key" class="key">V</span></li><li>Resize Element: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Alt key" class="key">Alt</span> + <span title="T key" class="key">T</span></li><li>Finish Resizing Element: <span title="Enter key" class="key">Enter</span></li><li>Nudge Element: (<span title="Control key" class="key">Ctrl</span>) <span title="Arrow keys" class="key">&larr;</span>,<span title="Arrow keys" class="key">&uarr;</span>,<span title="Arrow keys" class="key">&rarr;</span>,<span title="Arrow keys" class="key">&darr;</span></li><li>Delete Element: <span title="Delete key" class="key">Delete</span></li></ol></div><div>Text Mode Shortcuts<ol><li>Return to Drag Mode: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Enter key" class="key">Enter</span></li></ol></div></div></div></div>'),
		gridoverlay: $('<div id="remarklet-grid"></div>'),
		usercss: $('#remarklet-usercss').length === 0 ? $('<style id="remarklet-usercss" type="text/css"></style>') : $('#remarklet-usercss'),
		box: $('#remarklet-box').length === 0 ? $('<div id="remarklet-box"></div>') : $('#remarklet-box')
	};
	var controllers = {
		bodyElements: { /* Event delegation for visible, non-app elements. */
			mouseover: function(e){
				if(_dragging) return;
				var $this = _target = $(this).addClass('remarklet-target');
				switch(_mode){
					case 'drag':
						if(this.className.search(/ui-(resizable|wrapper)/) < 0){
							$this.draggable(dragOps);
						}
						break;
					case 'text':
						$this.attr('contenteditable','true');
						break;
					default: break;
				}
				/* Provide the target's CSS selector in the User CSS window. */
				var selector = this.tagName.toLowerCase();
				if($this.attr('id')!==undefined){
					selector += '#';
					selector += this.id;
				}
				selector += '.remarklet-';
				selector += $this.data('remarklet');
				views.csswindow.attr('data-remarklet-selector', selector);
				e.stopPropagation();
			},
			mouseout: function(e){
				if(_dragging) return;
				var $this = $(this).removeClass('remarklet-target');
				$('.ui-draggable').draggable('destroy');
				if(_mode == 'text'){
					$this.removeAttr('contenteditable');
				}
				e.stopPropagation();
			},
			mousedown: function(e){
				if(e.which!=1) return;
				_target = $(this);
				if(_mode == 'text') _texttarget = $(this);
				e.stopPropagation();
			},
			click: function(e){
				if(this.tagName == 'A'){
					e.preventDefault();
				}
			},
			mousemove: function(e){
				_mouse.update(e);
			},
			toggle: function(state){
				var name;
				if(state == 'on'){
					for(name in controllers.bodyElements){
						if(name != 'toggle'){
							$b.on(name, '.remarklet', controllers.bodyElements[name]);
						}
					}
				} else {
					for(name in controllers.bodyElements){
						if(name != 'toggle'){
							$b.off(name, '.remarklet', controllers.bodyElements[name]);
						}
					}
				}
			}
		},
		window: function(e){ /* Window keyboard shortcuts */
			if(e.target.id.indexOf('remarklet') >= 0) return;
			if(_mode == 'drag'){
				switch(e.keyCode){
					case 67: /*C*/
						if(e.ctrlKey){
							remarklet.clipboard = _target;
						}
						break;
					case 84: /*T*/
						if(!e.ctrlKey){
							controllers.switchmode('text');
							e.preventDefault();
						} else if(e.altKey){
							// Resolve existing draggable instances.
							/*$('.ui-draggable').each(function(){
								$(this).trigger('dragstop').draggable('destroy');
							});*/
							$('.ui-resizable,.ui-wrapper').each(function(){
								var $this = $(this);
								if($this.resizable('instance') != undefined){
									$this.trigger('resizestop').resizable('destroy');
								}
							});
							_target.resizable(resizeOps);
							//e.preventDefault();
						}
						break;
					case 86: /*V*/
						if(e.ctrlKey){
							_stored.editcounter++;
							if(remarklet.clipboard.draggable('instance')){
								remarklet.clipboard.draggable('destroy');
							}
							var original = remarklet.clipboard.removeClass('remarklet-target').get(0);
							var dupe = duplicate.create(original, original, {id: '', class: 'remarklet remarklet-' + _stored.editcounter});
							$(dupe).data('remarklet', _stored.editcounter);
						}
						break;
					case 13: /*Enter*/
						if($('.ui-resizable').length > 0){
							var $target = $('.ui-resizable'),
								style = $target.attr('style').replace(/(resize|position|right|bottom): (auto|none|static);\s?/g,'').replace(/(-?\d+)\.\d+px/g,'$1px');
							$target.resizable('destroy');
							controllers.finishChangingElement($target, style, true);
						}
						break;
					case 46: /*Del*/
							_target.remove();
						break;
					case 37: /* Left Arrow */
						if(!e.ctrlKey){
							_target.css('left', '-=1');
						} else {
							_target.css('left', '-=10');
						}
						e.preventDefault();
						break;
					case 38: /* Up Arrow */
						if(!e.ctrlKey){
							_target.css('top', '-=1');
						} else {
							_target.css('top', '-=10');
						}
						e.preventDefault();
						break;
					case 39: /* Right Arrow */
						if(!e.ctrlKey){
							_target.css('left', '+=1');
						} else {
							_target.css('left', '+=10');
						}
						e.preventDefault();
						break;
					case 40: /* Down Arrow */
						if(!e.ctrlKey){
							_target.css('top', '+=1');
						} else {
							_target.css('top', '+=10');
						}
						e.preventDefault();
						break;
					default: break;
				}
			} else {
				switch(e.keyCode){
					case 86: /*V*/
						if(!_texttarget){
							controllers.switchmode('drag');
							e.preventDefault();
						}
						break;
					case 13: /*Enter*/
						if(e.ctrlKey){
							controllers.switchmode('drag');
							e.preventDefault();
							e.stopPropagation();
						}
						break;
					default: break;
				}
			}
		},
		userCSSEditorKeyHandler: function(e){
			e.stopPropagation();
			var num, index, min, max, selection, val, lastchar, nextchar, addtext;
			switch(e.keyCode){
				case 9: /* Tab, insert indentation or css property */
					selection = views.csstextarea.getSelection();
					if(selection.length === 0){
						e.preventDefault();
						lastchar = views.csstextarea.val().charAt(selection.start-1);
						if(lastchar.match(/\w/)){
							views.csstextarea.insertText(': ', selection.start, 'collapseToEnd');
						} else {
							views.csstextarea.insertText(preferences.CSS_Editor.Indentation, selection.start, 'collapseToEnd');
						}
					}
					break;
				case 13: /* Enter, Insert indentation when pressing Enter after ; or { */
					selection = views.csstextarea.getSelection();
					lastchar = views.csstextarea.val().charAt(selection.start-1);
					if(selection.length === 0 && lastchar.match(/;|{/)){
						addtext = '\n'+preferences.CSS_Editor.Indentation;
						e.preventDefault();
						views.csstextarea.insertText(addtext, selection.start, 'collapseToEnd'); 
						if(lastchar=='{'){
							addtext = '\n}';
							views.csstextarea.insertText(addtext, selection.start+preferences.CSS_Editor.Indentation.length+1, 'collapseToStart');
						}
					}
					break;
				case 38: /* Up arrow key to increment numbers */
					if(e.ctrlKey){
						num = [];
						selection = views.csstextarea.getSelection();
						val = views.csstextarea.val();
						index = selection.start;
						if(val.charAt(selection.start-1).match(/\d/) || val.charAt(selection.start).match(/\d/)){
							while(val.charAt(index-1).match(/\d/)){
								index--;
							}
							min = index;
							while(val.charAt(index).match(/\d/)){
								num.push(val.charAt(index));
								index++;
							}
							max = index;
							num = parseInt(num.join('')) + 1;
							views.csstextarea.setSelection(min, max).replaceSelectedText(num, 'select').setSelection(min, max);
							e.preventDefault();
						}
					}
					break;
				case 40: /* Down arrow key to decrement numbers */
					if(e.ctrlKey){
						num = [];
						selection = views.csstextarea.getSelection();
						val = views.csstextarea.val();
						index = selection.start;
						if(val.charAt(selection.start-1).match(/\d/) || val.charAt(selection.start).match(/\d/)){
							while(val.charAt(index-1).match(/\d/)){
								index--;
							}
							min = index;
							while(val.charAt(index).match(/\d/)){
								num.push(val.charAt(index));
								index++;
							}
							max = index;
							num = parseInt(num.join('')) - 1;
							views.csstextarea.setSelection(min, max).replaceSelectedText(num, 'select').setSelection(min, max);
							e.preventDefault();
						}
					}
					break;
				default: break;
			}
			if(_typingTimer !== false){
				window.clearTimeout(_typingTimer);
			}
			_typingTimer = window.setTimeout(function(){
				views.csstextarea.trigger('stoptyping');
				_typingTimer = false;
			}, 500);
		},
		updateUserCSS: function(){
			stylesheet.setString(views.csstextarea.val());
		},
		updateUserCSSUI: function(){
			views.csstextarea.val(stylesheet.getString());
		},
		switchmode: function(newmode){
			$b.removeClass('remarklet-'+_mode+'mode').addClass('remarklet-'+newmode+'mode');
			_mode = newmode;
			if(newmode == 'drag'){
				$b.find('*[contenteditable]').removeAttr('contenteditable');
				_texttarget = false;
				_target.draggable(dragOps);
				/* HACK: Disabling content edit-ability on an element does not remove the cursor from that element in all browsers, so we create a temporary element to focus on and then remove it. */
				$('<input type="text" style="width:1px;height:1px;background-color:transparent;border:0 none;opacity:0;position:fixed;top:0;left:0;" />').appendTo($b).focus().blur().remove();
			} else if (newmode == 'text'){
				if(_target !== undefined){
					_target.attr('contenteditable','true');
				}
				$('.ui-draggable').draggable('destroy');
			}
		},
		finishChangingElement: function($el, style, remove){
			// Remove fractional pixel values.
			style = style.replace(/(-?\d+)\.\d+px/g,'$1px');
			stylesheet.setRule('.remarklet-' + $el.data('remarklet'), style);
			controllers.updateUserCSSUI();
			if(remove){
				$el.removeAttr('style');
			}
		}
	};
	var dragOps = {
		start: function(event, ui){
			_dragging = true;
			_target = $(event.target);
			$b.off('mousemove', _mouse.update);
		},
		stop: function(event, ui){
			var $target = $(event.target),
				style = $target.attr('style').replace(/(right|bottom): auto;\s?/g,''),
				removeStyle = false;
			_dragging = false;
			_mouse.update(event);
			$b.on('mousemove', _mouse.update);
			if($target.resizable('instance') != undefined){
				style = style.replace(/\s?overflow: hidden;\s?/,' ');
			} else {
				removeStyle = true;
			}
			controllers.finishChangingElement($target, style, false);
		}
	};
	var resizeOps = {
		start: function(event, ui){
			_target = $(event.target);
			$b.off('mousemove', _mouse.update);
			$('.ui-wrapper').each(function(){
				if(this != event.target){
					var style = this.style.cssText.replace(/\s?overflow: hidden;\s?/,' '),
						$target = $(this);
					controllers.finishChangingElement($target, style, false);
					$target.resizable('destroy');
				}
			});
		},
		stop: function(event, ui){
			var $target = $(event.target),
				style = $target.attr('style').replace(/(right|bottom): auto;\s?/g,''),
				removeStyle = false;
			_dragging = false;
			_mouse.update(event);
			$b.on('mousemove', _mouse.update);
			if($target.resizable('instance') != undefined){
				style = style.replace(/\s?overflow: hidden;\s?/,' ');
			} else {
				removeStyle = true;
			}
			controllers.finishChangingElement($target, style, false);
		}
	};
	var _mouse = {
		x: null,
		y: null,
		update: function(e){
			_mouse.x = e.pageX - views.box.offset().left;
			_mouse.y = e.pageY;
		}
	};
	var settings = preferences;
	/* Define commands that the user can execute */
	var command = {
		File: {
			Export: function(){
				var data = 'data:text/html;charset=UTF-8,',
					pathpart = location.pathname.split('/'),
					html; 
				views.usercss.html(stylesheet.getString());
				pathpart.pop();
				pathpart = pathpart.join('/');
				if(document.doctype && document.doctype.publicId===''){
					html = '<!DOCTYPE html>';
				} else {
					if(document.doctype){
						html = '<!DOCTYPE ';
						html += document.doctype.name.toUpperCase();
						html += ' PUBLIC "';
						html += document.doctype.publicId;
						html += '" "';
						html += document.doctype.systemId;
						html += '">';
					} else {
						html = document.all[0].text;
					}
				}
				html += document.documentElement.outerHTML;
				$('script[src*="remarklet.com/rm/scripts"],link[href*="remarklet.com/rm/scripts"]').add(views.retained).each(function(){
					html = html.replace(this.outerHTML, '');
				});
				html = html.replace(/.overflowRulerX > .firebug[^{]+{[^}]+}|.overflowRulerY\s>\s.firebug[^{]+{[^}]+}/gi,'').replace(/(src|href)=("|')\/\//g, '$1=$2'+location.protocol).replace(/(src|href)=("|')(\/|(?=[^:]{6}))/gi, '$1=$2'+location.protocol + '//' + location.hostname + pathpart + '/').replace(/<script/gi,'<!-- script').replace(/<\/script>/gi,'</script -->').replace(/url\(&quot;/gi,'url(').replace(/.(a-z){3}&quot;\)/gi,'$1)').replace(/url\(\//gi,'url('+location.protocol+'//'+location.hostname+pathpart+'/').replace(/\sremarklet-show-(grid|outlines|usercss)\s/g,' ').replace(/\s?remarklet-show-(grid|outlines|usercss)\s?|\s/g,' ');
				data += encodeURIComponent(html);
				window.open(data, 'Exported From Remarklet', '');
			},
			Save: function(){
				remarklet.pageSavedState = '';
				$b.children().not(views.retained).each(function(){
					remarklet.pageSavedState += this.outerHTML.replace(/<script/gi,'<!-- script').replace(/<\/script>/gi,'</script -->');
				});
			},
			Restore: function(){
				if(remarklet.pageSavedState !== ''){
					$b.children().not(views.retained).remove();
					$b.prepend(remarklet.pageSavedState);
					views.usercss = $('#remarklet-usercss');
					views.box = $('#remarklet-box');
				}
			}
		},
		View: {
			Grid: function(){
				$b.toggleClass('remarklet-show-grid');
			},
			Outlines: function(){
				$b.toggleClass('remarklet-show-outlines');
			},
			CSS: function(){
				$b.toggleClass('remarklet-show-usercss');
				if($b.hasClass('remarklet-show-usercss')){
					views.csstextarea.focus();
				} else {
					views.csstextarea.blur();
				}
			},
			Preferences: function(){
				// Use a prompt window to visualize the remarklet.preferences object, and customizations are saved in localStorage using the localSettings module.
				// The only element in the Preferences window that should have an event is the "Save" button.
				$b.toggleClass('remarklet-show-preferences');
			}
		},
		Insert: {
			Image: function(){
				prompt.open({
					form: views.newimageform,
					init: function(){
						/* File browse button data handler */
						/* <br><label>Add local file <span title="This image will expire when you leave the page, and will not be stored if you save the page as an HTML file." class="remarklet-hovernote">?</span></label><input name="file" id="remarklet-file" type="file"/>
						prompt.get.window().find('#remarklet-file').on('change', function(){
							prompt.get.submit().attr('disabled',true);
							var f = this.files[0];
							var fr = new FileReader();
							fr.onload = function(){
								prompt.get.submit().removeAttr('disabled');
								_stored.fileRead = remarklet.getBlobURL(f);
							};
							fr.readAsDataURL(f);
						}); */
						$b.off('mousemove', _mouse.update);
					},
					callback: function(data){
						prompt.get.window().find('#remarklet-file').off('change');
						_stored.editcounter++;
						var str,
							ednum = _stored.editcounter,
							defaultstyles = ['position:absolute;left:',_mouse.x,'px;top:',_mouse.y,'px;z-index:2147483647;'].join('');
						if(data.imgurl.length>1){
							str = ['<img src="',data.imgurl,'" class="remarklet-newimg" style="',defaultstyles,'" />'];
						} else if(_stored.fileRead!==false){
							str = ['<img class="remarklet-newimg" src="',_stored.fileRead,'" style="',defaultstyles,'" />'];
							_stored.fileRead = false;
						} else {
							str = ['<div class="remarklet-newimg" style="',defaultstyles,'font:normal 16px Arial,Helvetica,sans-serif;color:',data.textcolor,';background-color:',data.bgcolor,';width:',data.imgdimensions.toLowerCase().split('x')[0],'px;height:',data.imgdimensions.toLowerCase().split('x')[1],'px;">',data.imgtext,'</div>'];
						}
						str = str.join('');
						$(str).data('remarklet', ednum).addClass('remarklet remarklet-' + ednum).appendTo(views.box);
						$b.on('mousemove', _mouse.update);
					}
				});
			},
			Note: function(){
				prompt.open({
					form: views.newnoteform,
					init: function(){
						$b.off('mousemove', _mouse.update);
					},
					callback: function(data){
						_stored.editcounter++;
						/* Characters seem to be 8px wide */
						var width = data.notetext.length * 8,
							ednum = _stored.editcounter,
							str;
						if(width > 500){
							width = 500;
						}
						str = ['<div class="remarklet-note" style="position: absolute; z-index: 2147483647; background-color: #feff81; padding: 10px; font-family: monospace; box-shadow: 0 3px 5px #000; word-wrap: break-word; left:',_mouse.x,'px;top:',_mouse.y,'px;width:',width,'px">',data.notetext,'</div>'].join('');
						$(str).data('remarklet', ednum).addClass('remarklet remarklet-' + ednum).appendTo(views.box);
						$b.on('mousemove', _mouse.update);
					}
				});
			},
			HTML: function(){
				prompt.open({
					form: views.newhtmlform,
					init: function(){
						$b.off('mousemove', _mouse.update);
					},
					callback: function(data){
						_stored.editcounter++;
						var str, ednum = _stored.editcounter;
						str = ['<div class="remarklet-usercode" style="position:absolute;left:',_mouse.x,'px;top:',_mouse.y,'px;">',data.remarkletinserthtml,'</div>'].join('');
						$(str).data('remarklet', ednum).addClass('remarklet remarklet-' + ednum).appendTo(views.box).css({
							width: function(){return this.clientWidth + 1;},
							height: function(){return this.clientHeight + 1;}
						});
						$b.on('mousemove', _mouse.update);
					}
				});
			}
		},
		Help: function(){
			// Show keyboard shortcuts and explain some processes in a prompt window with only a close button.
			$b.toggleClass('remarklet-show-help');
		}
	};
	var doFormat = function(usercommandName, showDefaultUI, valueArgument) {
		// FROM https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla, replace later with WYSIWYG
		var d;
		if(valueArgument===undefined) valueArgument = null;
		if(showDefaultUI===undefined) showDefaultUI = false;
		if(d.queryusercommandEnabled(usercommandName)){
			d.execusercommand(usercommandName, showDefaultUI, valueArgument);
		} else if(usercommandName=='increasefontsize' || usercommandName=='decreasefontsize'){
			var s = prompt('Enter new font size (between 1 and 7)','');
			d.execusercommand('fontsize',true,s);
		}
	};
	views.build = function(){
		var name, subname, prop, $menu, $submenu, m = menu, c = command;
		for(name in m){
			$menu = $('<li>' + name + '</li>');
			prop = m[name];
			if(typeof prop == 'object'){
				$submenu = $('<ol class="remarklet-submenu"></ol>');
				for(subname in prop){
					$('<li class="remarklet-menu-' + subname.toLowerCase() + '">' + subname + '</li>').on('click', c[name][subname]).appendTo($submenu);
				}
				$menu.append($submenu);
			} else {
				$menu.on('click', c[name]);
			}
			$menu.appendTo(views.menuwrapper).wrap('<ol class="remarklet-menuitem"></ol>');
		}
		
		/* Add remaining app UI events */
		views.csstextarea.on('keydown', controllers.userCSSEditorKeyHandler);
		views.help.on('click', command.Help);
		views.csstextarea.on('stoptyping', controllers.updateUserCSS);
		$w.on('keydown', controllers.window);
		
		/* Insert app elements into page. */
		views.box.add(views.usercss).appendTo($b);
		views.retained = views.gridoverlay.add(views.csswindow.append(views.csstextarea)).add(views.help).add(prompt.get.window()).add(views.preferences).add(views.menuwrapper).appendTo($b);
	};
	remarklet.init = function(){		
		/* Tag all non-app page elements we may want to interact with. */
		var last = 0;
		$('.remarklet').each(function(){
			var num = parseInt(this.className.match(/remarklet-([0-9]+)/)[1]);
			if(num > last){
				last = num;
			}
		});
		$b.find('*:not(:hidden,.remarklet)').each(function(){
			last++;
			var num = last;
			$(this).data('remarklet',num).addClass('remarklet remarklet-' + num);
		});
		_stored.editcounter = last;
		
		/* Initialize modules. */
		prompt.init('remarklet');
		stylesheet.init({element: views.usercss.get(0), indent: preferences.CSS_Editor.Indentation});
		duplicate.init(stylesheet);
		
		/* Add UI Elements to page. */
		views.build();
		duplicate.setSheet(views.usercss.get(0));
		/* Event delegation for non-app elements. */
		controllers.bodyElements.toggle('on');
	};
	remarklet.init();
	/* http://remysharp.com/2009/02/27/analytics-for-bookmarklets-injected-scripts/ */
	function gaTrack(g,h,i){function c(e,j){return e+Math.floor(Math.random()*(j-e));}var f=1000000000,k=c(f,9999999999),a=c(10000000,99999999),l=c(f,2147483647),b=(new Date()).getTime(),d=window.location,m=new Image(),n='//www.google-analytics.com/__utm.gif?utmwv=1.3&utmn='+k+'&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn='+h+'&utmr='+d+'&utmp='+i+'&utmac='+g+'&utmcc=__utma%3D'+a+'.'+l+'.'+b+'.'+b+'.'+b+'.2%3B%2B__utmb%3D'+a+'%3B%2B__utmc%3D'+a+'%3B%2B__utmz%3D'+a+'.'+b+'.2.2.utmccn%3D(referral)%7Cutmcsr%3D'+d.host+'%7Cutmcct%3D'+d.pathname+'%7Cutmcmd%3Dreferral%3B%2B__utmv%3D'+a+'.-%3B';m.src=n;}
	gaTrack('UA-44858109-1', 'remarklet.com', '/files/remarklet.js');
});