/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	var oMerge = require("mout/object/merge"),
		globalPathsJSON = grunt.file.readJSON("./generator/grunt/paths.json"),
		target = (grunt.option('target') || "") + "/grunt",
		requirejsGlobals = {
			"baseUrl": ".",
			"paths": {
				"app": "<%= paths.js_source %>/app",
				"mod": "<%= paths.js_source %>/modules",

				"jquery": "<%= paths.bower_path %>/jquery/jquery",
				"highlightjs": "<%= paths.bower_path %>/highlightjs/highlight.pack",
				"requirejs": "<%= paths.bower_path %>/requirejs/require",
				"modernizr": "<%= paths.bower_path %>/modernizr/modernizr",
				"colorjs": "<%= paths.bower_path %>/color-js/color"
			},
			"optimize": "uglify",
			"skipModuleInsertion": false,
			"generateSourceMaps": false,
			"preserveLicenseComments": false
		},
		config = {
			concat: {},
			paths: oMerge(
				globalPathsJSON,
				grunt.file.readJSON("./generator/" + target + "/paths.json")
			),
			sass: {
				"main": {
					"options" : {
						"style": "compressed",
						"trace":true,
						"quiet" : false,
						"noCache": false,
						"loadPath": "<%= paths.bower_path %>"
					},
					"files": [{
						"expand": true,
						"cwd": "<%= paths.sass_source %>",
						"src": ["**/*.scss"],
						"dest": "<%= paths.sass_output%>",
						"ext": ".css"
					}]
				}
			},
			watch: {
				"sass": {
					"files": ["<%= paths.sass_watch %>"],
					"tasks": ["comp-sass"]
				},
				"render-views": {
					"files": ["<%= paths.templates_watch %>"],
					"tasks": ["render-views"]
				}
			},
			clean: {
				guideline: [ "<%= paths.output %>/*.html" ],
				sass: [ "<%= paths.sass_output %>/**/*.css" ],
				js: [ "<%= paths.js_output %>/**/*.js" ]
			},
			jshint: {
				options: grunt.file.readJSON(".jshintrc"),
				all: {
					src: ['<%= paths.js_source %>/**/*.js']
				}
			},
			requirejs: (function(data) {
				var n, returnValue = {};
				if (!data){
					return {};
				}
				for (n in data) {
					returnValue[n] = {
						"options": oMerge(requirejsGlobals, data[n])
					};
				}
				return returnValue;
			}(grunt.file.readJSON("./generator/grunt/js.json"))),
			"render-views": grunt.file.readJSON("./generator/" + target + "/views.json")
		};

	grunt.initConfig(config);

	// "private" tasks (TODO: see what can be done to not have this as tasks)
	grunt.registerTask('render-template', "render target template", function (test_name) {
		var task = require("./generator/grunt/tasks/task-render-file");
		task.run(grunt, this);
	});

	grunt.registerMultiTask('render-views', "run the task 'comp-js' to all targets", function () {
		var task = require("./generator/grunt/tasks/task-render-view");
		task.run(grunt, this);
	});

	grunt.registerTask("clear-views", ["clean:guideline"]);
	grunt.registerTask("render", ["sass", "clean:guideline", "render-views"]);
	grunt.registerTask("default", ["clean", "requirejs", "sass", "render-views"]);
};