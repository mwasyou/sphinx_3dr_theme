module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    open : {
      dev: {
        path: 'http://localhost:1919'
      }
    },

    connect: {
      server: {
        options: {
          port: 1919,
          base: 'demo_docs/build',
          livereload: true
        }
      }
    },
    copy: {
      dependencies: {
        files: [
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
							'bower_components/modernizr/modernizr.js',
							'bower_components/jquery/dist/jquery.js'
						],
						dest: 'sphinx_3dr_theme/static/js'
					},
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/font-awesome/fonts/*'
						],
						dest: 'sphinx_3dr_theme/static/fonts/'
					}
        ]
      }
    },
    sass: {
      dev: {
        options: {
          style: 'expanded',
          loadPath: [
						'bower_components/bootstrap-sass/assets/stylesheets',
						'bower_components/font-awesome/scss',
						'sass'
					]
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'sphinx_3dr_theme/static/css',
          ext: '.css'
        }]
      },
      build: {
        options: {
          style: 'compressed',
          loadPath: [
						'bower_components/bootstrap-sass/assets/stylesheets',
					]
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.sass'],
          dest: 'sphinx_3dr_theme/static/css',
          ext: '.css'
        }]
      }
    },

    exec: {
      bower_update: {
        cmd: 'bower update'
      },
      build_sphinx: {
        cmd: 'sphinx-build demo_docs/source demo_docs/build'
      }
    },
    clean: {
      build: ["demo_docs/build"],
      dependencies: [
				"sphinx_3dr_theme/static/fonts",
				"sphinx_3dr_theme/static/js",
				"sphinx_3dr_theme/static/css"
			]
    },

    watch: {
      /* Compile sass changes into theme directory */
      sass: {
        files: ['sass/*.scss', 'bower_components/**/*.scss'],
        tasks: ['sass:dev']
      },
      /* Changes in theme dir rebuild sphinx */
      sphinx: {
        files: ['sphinx_3dr_theme/**/*', 'demo_docs/**/*.rst', 'demo_docs/**/*.py'],
        tasks: ['clean:build','exec:build_sphinx']
      },
      /* live-reload the demo_docs if sphinx re-builds */
      livereload: {
        files: ['demo_docs/build/**/*'],
        options: { livereload: true }
      }
    }

  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('dependencies', [
		'clean:dependencies',
		'copy:dependencies'
	]);
  grunt.registerTask('default', [
		'clean:build',
		'dependencies',
		'sass:dev',
		'exec:build_sphinx',
		'connect',
		'open',
		'watch'
	]);
  grunt.registerTask('build', [
		'exec:bower_update',
		'clean:build',
		//'sass:build',
		'exec:build_sphinx'
	]);
};

