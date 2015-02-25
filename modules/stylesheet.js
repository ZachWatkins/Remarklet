/* Stylesheet Module */
var stylesheet = (function(){
	var style;
	var rules = {};
	return {
		init: function(obj){
			style = obj;
		},
		setRule: function(selector, rule){
			if(!rule) return;
			var found = false,
				i = style.sheet.cssRules.length-1;
			rule = '{' + rule + '}';
			while(i >= 0){
				if(selector == style.sheet.cssRules[i].selectorText){
					found = style.sheet.cssRules[i];
					i = 0;
				}
				i--;
			}
			if(!found){
				style.sheet.insertRule(selector + rule, style.sheet.cssRules.length);
			} else {
				found.style.cssText = found.style.cssText.replace(/}.*$/,'') + rule.slice(1);
				rule = '{'+found.style.cssText+'}';
			}
			rules[selector] = rule;
		},
		fromHTML: function(html){
			var t, name;
			html = html.replace(/<br>/g,' ').replace(/(&nbsp;|\s)+/g,' ').replace(/\s*([{}]+)\s+/g,'$1').split('}').slice(0,-1);
			rules = {};
			for(var i=0, len=html.length; i<len; i++){
				t = html[i].split('{');
				rules[t[0]] = '{' + t[1] + '}';
			}
			t = '';
			for(name in rules){ 
				t += name;
				t += ' ';
				t += rules[name].replace(/({|;)\s*/g,'$1\n    ').replace('    }','}\n');
			}
			style.innerHTML = t;
		},
		getRules: function(){
			return rules;
		}
	};
}());