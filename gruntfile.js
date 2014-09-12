module.exports = function(grunt) {

	grunt.initConfig({
		sass: {
			dist: {
				options: {
					style: 'compressed',
					loadPath: 'bower_components',
					trace: true,
					precision: 8,
					bundleExec: true
				},
				files: [{
					src: './sass/example.scss',
					dest: './css/example.css'
				}]
			},
			test: {
				options: {
					style: 'compressed',
					loadPath: 'bower_components',
					trace: true,
					precision: 8,
					bundleExec: true
				},
				files: [{
					src: './sass/test.scss',
					dest: './css/test.css'
				}]
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'qunit']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass']);

};
