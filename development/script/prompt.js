/* Prompt Window Module. Dependency: jQuery */
var prompt = (function(){
	var $ = jQuery,
		callback, formobj;
	var open = function(args){
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