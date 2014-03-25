exports.run = function (grunt, task) {

	var render = require("../modules/mod-render").render,
		diff = require("mout/array/difference"),
		deepMixIn = require("mout/object/deepMixIn"),
		forEach = require("mout/array/forEach"),
		keys = require("mout/object/keys"),
		map = require("mout/object/map"),
		path = grunt.config.get("paths"),
		blob, value;

	path = render(path);

	if(!task.data){
		grunt.fail.fatal("Test failed.\nNo test found!'");
		return;
	}

	var diff_result = diff(["dest", "files"], keys(task.data));
	if (!!diff_result.length) {
		grunt.fail.fatal("Test failed.\nMissing properties: '"+diff_result.join("','")+"'.");
		return;
	}

	// apply paths to data from views.json
	value = render(task.data, path);

	//TODO: ORGANIZE THIS LATER
	var getData = function (data) {
		var obj = {};
		if (!data) {
			return obj;
		}
		switch (data.constructor.name) {
			case "String":
				if (grunt.file.exists(data)){
					obj = grunt.file.readJSON(data);
				}
				break;
			case "Array":
				forEach(data, function (item, i) {
					var curr = getData(item);
					if (curr) {
						deepMixIn(obj, curr);
					}
				});
				break;
			case "Object":
				obj = data;
				break;
		}
		return obj;
	};

	if (!!value.data) {
		value.data = render(getData(value.data), path);
	}

	if(!!value.raw && value.raw.constructor.name === "Object"){
		value.raw = map(value.raw,function(value){
			if (grunt.file.exists(value)){
				return grunt.file.read(value);
			}
			return value;
		});
	}

	blob = grunt.config.get("concat");
	blob[task.target] = {
		src : task.data.files,
		dest :task.data.dest
	};

	grunt.config.set("concat",blob);
	grunt.config.set("blob-"+task.target, value);
	grunt.task.run([
		"concat:"+task.target,
		"render-template:"+task.target
	]);
};