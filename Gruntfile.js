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
    forever: {
      prestige:{
        options: {
          index: 'app.js',
          logDir: 'log'
        }
      }
    }
  });
  grunt.registerTask('start', ['forever:prestige:start']);
  grunt.registerTask('stop', ['forever:prestige:stop']);
  grunt.registerTask('default', ['jshint', 'plato:coverage', 'mochaTest']);
  grunt.registerTask('plato', ['plato:coverage']);
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};
