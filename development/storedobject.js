/* Locally Stored Object module */
define(function(){
	var dbname, def, dataset = {};
	var set = function(name, data){
		if(data){
			dataset[name] = data;
		} else {
			dataset = name;
		}
		localStorage[dbname] = JSON.stringify(dataset);
		return this;
	};
	return {
		init: function(uniquename, defs){
			var name, storage;
			dbname = uniquename;
			def = defs;
			dataset = Object.create(defs);
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
});