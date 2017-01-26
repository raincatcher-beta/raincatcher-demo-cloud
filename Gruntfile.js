module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  'use strict';
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js", "test/**/*.spec.js"]
    },
    mochify: {
      options: {
        reporter: 'spec'
      },
      unit: {
        src: ['lib/**/**/*-spec.js']
      }
    }
  });

  grunt.registerTask('test', ['eslint', 'mochify:unit']);
  grunt.registerTask('default', ['eslint']);
};
