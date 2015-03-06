/* Element Duplication Module. Dependency: stylesheet module */
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