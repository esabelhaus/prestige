module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: ['routes/*.js', 'app/*.js', 'app.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        maxdepth: 2,
        maxcomplexity: 4,
        strict: true,
        undef: false,
        eqeqeq: true
      },
    },
    plato: {
      coverage: {
        options: {
        },
        files: {
          'plato': ['routes/*.js', 'app/*.js', 'app.js']
        }
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js'],
        options: {
          captureFile: 'mocha/results.txt'
        }
      }
    },
    shell: {
        options: {
            stderr: false
        },
        target: {
            command: 'istanbul cover test/**/*js'
        }
    },
    forever: {
      prestige:{
        options: {
          index: 'app.js',
          logDir: 'log'
        }
      }
    }
  });
  //grunt
  grunt.registerTask('default', ['jshint', 'plato:coverage', 'shell']);
  //start and stop
  grunt.registerTask('start', ['forever:prestige:start']);
  grunt.registerTask('stop', ['forever:prestige:stop']);
  //individual testing tasks
  grunt.registerTask('plato', ['plato:coverage']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('coverage', ['shell']);

  //load packages
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};
