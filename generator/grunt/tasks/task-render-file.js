exports.run = function (grunt, task) {

	var mustache = require("mustache"),
		render = require("../modules/mod-render").render,
		mixIn = require("mout/object/deepMixIn"),
		file, file_name, rendered, blob, name, mock;

	name = task.args[0];
	if (!name){
		grunt.fail.warn("No page to render.");
		return;
	}

	mock = grunt.config.getRaw("blob-"+name);
	if (!mock){
		grunt.fail.warn("No data found to target",name);
		return;
	}

	// let the target name accessible from the template
	if (!mock.data) {
		mock.data = {};
	}
	if (!mock.data.name) {
		mock.data.name = name;
	}

	file_name = mock.dest;

	//read target file
	try {
		file = grunt.file.read(file_name);
	} catch (err) {
		grunt.fail.warn("Coudn't open file: "+file_name);
		return;
	}

	if (!file || !file.length){
		grunt.fail.warn(file_name+" seems to be empty");
		return;
	}

	//render file
	mock.get_raw = function(){
		return function(text,render){
			return render("{{{raw."+render(text)+"}}}");
		};
	};
	mock.html_unicode = function(){
		// Converts received text as HTML escaped unicode symbol
		// if a single letter is received, just print it.
		return function(text,render){
			text = render(text);
			text = (text || "").replace(/^\s+|\s+$/gmi, "");

			if (text.length > 1) {
				text = "&#x" + text.replace(/\\/g, "") + ";";
			}

			return text;
		};
	};
	mock.include = function(){
		var _render = render,
			paths = _render(grunt.config.get("paths"));
			paths = mixIn(paths, mock);
		return function(text,render){
			var file = (_render(text, paths) || "").replace(/^\s+|\s+$/gmi, '');
			if (grunt.file.exists(file)){
				file = grunt.file.read(file);
			}
			return render(file);
		};
	};
	rendered = mustache.render(file,mock);

	//save rendeted file
	try{
		grunt.file.write(file_name, "\ufeff"+rendered); // generating with BOM
	} catch (err) {
		grunt.fail.warn("Failed to save file: "+value.dest);
		return;
	}
	grunt.log.ok(file_name+" rendered successfully");
};