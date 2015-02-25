/* Prompt Window Module. Dependencies: jQuery */
var prompt = (function(){
	var callback = function(){};
	var open = function(args){
		ui.form.html(args.form);
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
		ui.window.hide();
	};
	var cancel = function(){
		ui.window.focus().blur().hide();
	};
	var ui = {
		window: $('<div></div>').on('keydown', keydown),
		form: $('<div></div>'),
		content: $('<div></div>'),
		submit: $('<button type="button">Submit</button>').on('click', submit),
		cancel: $('<button type="button">Cancel</button>').on('click', cancel)
	};
	var keydown = function(e){
		e.stopPropagation();
		switch(e.keyCode){
			case 27:
				/* Escape => Cancel form */
				e.preventDefault();
				cancel();
				break;
			default: break;
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