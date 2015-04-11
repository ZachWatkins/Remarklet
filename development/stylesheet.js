/* Stylesheet Module for RequireJS */
define('stylesheet', function(){
	var styleEl, indent, rules = {},
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
		};
	return {
		init: function(args){
			styleEl = args.element;
			indent = args.indent;
		},
		setSheet: function(stylesheetelement){
			styleEl = stylesheetelement;
		},
		setRule: function(selector, rule){
			if(!rule) return;
			var ruletext, found = false,
				i = styleEl.sheet.cssRules.length-1;
			ruletext = '{\n' + indent + rule.replace(/; (\w)/g, ';\n'+indent+'$1') + '\n}';
			while(i >= 0){
				if(selector == styleEl.sheet.cssRules[i].selectorText){
					found = styleEl.sheet.cssRules[i];
					i = 0;
				}
				i--;
			}
			if(!found){
				styleEl.sheet.insertRule(selector + ruletext, styleEl.sheet.cssRules.length);
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
			styleEl.textContent = rulesToString();
		},
		setString: function(str){
			if(styleEl.textContent != str){
				var t, arr = str.split('}').slice(0,-1);
				rules = {};
				for(var i=0, len=arr.length; i<len; i++){
					t = arr[i].split('{');
					rules[t[0].trim()] = '{' + t[1] + '}';
				}
				styleEl.textContent = str;
			}
		},
		getRules: function(){
			return rules;
		},
		getString: function(){
			return styleEl.textContent;
		},
        getElement: function(){
            return styleEl;
        }
	};
});