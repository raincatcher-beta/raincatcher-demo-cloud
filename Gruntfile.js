module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  'use strict';
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js", "test/**/*.spec.js"]
    },
    mochaTest: {
      test: {
        src: ['lib/**/*-spec.js'],
        options: {
          reporter: 'Spec',
          logErrors: true,
          timeout: 1000,
          run: true
        }
      }
    }
  });

  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('default', ['test']);
};
