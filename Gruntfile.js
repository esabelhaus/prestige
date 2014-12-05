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
      options: {
      },
      your_target: {
        // Target-specific file lists and/or options go here.
      }
    }
  });
  grunt.registerTask('default', ['jshint']);
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
};
