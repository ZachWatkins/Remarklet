/*  Element Duplication module.
	Dependencies: RequireJS, Stylesheet module (http://codepen.io/zw/pen/JompNy.js)
	Tasks: 
		# Create <clone> from <original> element and its children.
		# Add <clone> to page where desired.
		# Override id and class attributes for <clone> if desired.
		# Add rules to <stylesheet> that <original> and its children have and <clone> and
		  its children do not have, using the ID and class from <clone> for the new rule's CSS selector.
*/
define('duplicate', ['stylesheet'], function(stylesheet){
	var addRule;
	var getSelector = function(el){
		var value = el.tagName.toLowerCase(),
			id = el.id,
			className = el.className;
		if(id !== ''){
			value += '#';
			value += el.id;
			}
		if(className.trim() !== ''){
			value += '.';
			value += className.trim().replace(/\s+/g,'.');
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
	var getUniqueStyles = function(original, clone, pseudoelement){
		/* 
			# If <pseudoelement>, and its content is not defined, return immediately;
			# Compare styles of <original> and <clone>, or their <pseudoelement>s;
			# If <original> has styles that <clone> does not have, validate them;
			# If unique style is valid, add it to returned values;
			# Return all unique and valid styles.
		*/
		var elStyle = window.getComputedStyle(original, pseudoelement);
		if(pseudoelement != undefined && elStyle.content == 'none'){
			return '';
		}
		var cloneStyle = window.getComputedStyle(clone, pseudoelement),
			values = '', i = 0, len = elStyle.length,
			ignore, prop, value;
		for(; i<len; i++){
			ignore = false;
			prop = elStyle[i];
			value = elStyle.getPropertyValue(prop);
			if(value != cloneStyle.getPropertyValue(prop)){
				switch(prop){
					case 'outline-color':
          case 'text-decoration-color':
					case '-webkit-text-emphasis-color':
					case '-webkit-text-fill-color':
					case '-webkit-text-stroke-color':
					case '-moz-text-decoration-color':
					case '-webkit-text-decoration-color':
						if(value == elStyle.color){
							ignore = true;
						}
						break;
					case 'border-bottom-color':
					case 'border-left-color':
					case 'border-right-color':
					case 'border-top-color':
						if(elStyle.borderWidth === '' || elStyle.borderWidth == '0px'){
							ignore = true;
						}
						break;
					case '-moz-column-rule-color':
					case '-webkit-column-rule-color':
						if(elStyle.getPropertyValue(prop.replace('color','width')) == '0px'){
							ignore = true;
						}
						break;
          case 'text-decoration-line':
					case '-moz-text-decoration-line':
					case '-webkit-text-decoration-line':
						if(value == elStyle.textDecoration){
							ignore = true;
						}
						break;
          case 'column-gap':
					case '-moz-column-gap':
					case '-webkit-column-gap':
						if(elStyle.getPropertyValue(prop.replace('gap','count')) == 'auto' && elStyle.getPropertyValue(prop.replace('gap','width')) == 'auto'){
							ignore = true;
						}
						break;
					case 'transform-origin':
					case 'perspective-origin':
						if(elStyle.getPropertyValue(prop.replace('-origin','')) == 'none'){
							ignore = true;
						}
						break;
					case '-webkit-text-decorations-in-effect':
						ignore = true;
						break;
					case 'content':
						if(value == 'none'){
							ignore = true;
						}
						break;
					default:
						break;
				}
				if(!ignore){
					values += prop;
					values += ': ';
					values += value;
					values += '; ';
				}
			}
		}
		return values;
	};
	return {
		init: function(args){
			stylesheet.init(args);
			addRule = stylesheet.setRule;
		},
		create: function(original, destination, attrs){
			if(typeof original === 'string'){
				original = document.querySelector(original);
			}
			var clone = original.cloneNode(true),
				originalChildren = original.getElementsByTagName('*'),
				cloneChildren = clone.getElementsByTagName('*'),
				rules = stylesheet.getRules(),
				origEl = original,
				cloneEl = clone,
				len = originalChildren.length,
				i;
			
			/* Add cloned element to page. */
			if(typeof destination == 'string'){
				document.querySelector(destination).appendChild(clone);
			} else {
				if(destination.nextSibling){
					destination.parentNode.insertBefore(clone, destination.nextSibling);
				} else {
					destination.parentNode.appendChild(clone);
				}
			}
			
			/* Set up clone with custom attributes if provided. */
			if(attrs){
				if(attrs['id']){
					if(attrs['id'] != ''){
						clone.id = attrs['id'];
					} else {
						clone.removeAttribute('id');
					}
				}
				if(attrs['class']){
					if(attrs['class'] != ''){
						clone.className = attrs['class'];
					} else {
						clone.removeAttribute('class');
					}
				}
			}
			
			/* Process each element and add rules if getUniqueStyles returns a value. */
			for(i=0; i<=len; i++){
				if(i){
					origEl = originalChildren[i-1];
					cloneEl = cloneChildren[i-1];
				}
				cloneSelector = getSelectorsBetween(clone, cloneEl);
				if(!rules.hasOwnProperty(cloneSelector)){
					addRule(cloneSelector, getUniqueStyles(origEl, cloneEl));
					addRule(cloneSelector+':before', getUniqueStyles(origEl, cloneEl, ':before'));
					addRule(cloneSelector+':after', getUniqueStyles(origEl, cloneEl, ':after'));
				}
			}
			return clone;
		}
	};
});