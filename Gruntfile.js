module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: ['./lib/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        maxdepth: 4,
        maxcomplexity: 6,
        strict: true,
        undef: false,
        eqeqeq: true,
        esnext: true
      },
    },
    plato: {
      coverage: {
        options: {
          maxdepth: 4,
          maxcomplexity: 6,
          strict: true,
          undef: false,
          eqeqeq: true
        },
        files: {
          'plato': ['lib/**/*.js']
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
    }
  });
  //grunt
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  //individual testing tasks
  grunt.registerTask('plato', ['plato:coverage']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('coverage', ['shell']);

  //load packages
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};
