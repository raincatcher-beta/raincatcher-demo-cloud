'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['public/views/**', 'app/views/**'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          watch: ['lib'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch'],
      debug: ['node-inspector', 'shell:debug', 'open:debug'],
      options: {
        logConcurrentOutput: true
      }
    },
    env : {
      options : {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {
        FH_USE_LOCAL_DB: true,
        WFM_USE_MEMORY_STORE: false, //Used to specify which store to be used. If false, it will use persistent store
        FH_MONGODB_CONN_URL: "mongodb://localhost/raincatch",
        WFM_AUTH_GUID: 'v5ay3ztx6adgquvf2analme6',
        WFM_AUTH_POLICY_ID: 'wfm',
        FH_MBAAS_ENV_ACCESS_KEY:	"5874d992e8d52688532911af",
        FH_MBAAS_HOST:	"mbaas.mbaas1.eu.feedhenry.com",
        FH_MBAAS_ID:	"ema1-mbaas1",
        FH_MBAAS_PROTOCOL:	"https",
        FH_MBAAS_TYPE:	"feedhenry",
        FH_SKIP_MBAAS_AUTH: true,
        FH_INSTANCE: "r55tw36wqrhdxc7oviaepzk7",
        FH_WIDGET: "r55tw32dfwsdtv3tfxqvxcht",
        FH_DOMAIN: "testing",
        FH_ENV: "dev",
        FH_APPNAME: "testing-r55tw36wqrhdxc7oviaepzk7-dev",
        FH_APP_API_KEY: "d305e5bafa5a8a22656b0a46d7b60d043210a238",
        /*
         * This is mapping to authentication service, when running raincatcher-demo-auth locally it will map to it
         * allowing correct authentication.
         */
        FH_SERVICE_MAP: function() {
          /*
           * Define the mappings for your services here - for local development.
           * You must provide a mapping for each service you wish to access
           * This can be a mapping to a locally running instance of the service (for local development)
           * or a remote instance.
           */
          var serviceMap = {
            'v5ay3ztx6adgquvf2analme6': 'http://localhost:8002'
          };
          return JSON.stringify(serviceMap);
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'env NODE_PATH=. node --debug-brk application.js'
      },
      unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/unit/'
      },
      accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/server.js test/accept/'
      },
      coverage_unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-unit',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-unit ./node_modules/.bin/_mocha -- -A -u exports --recursive test/unit/',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      },
      coverage_accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-accept',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-accept ./node_modules/.bin/_mocha -- -A -u exports --recursive test/server.js test/accept/',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      }
    },
    open: {
      debug: {
        path: 'http://127.0.0.1:8080/debug?port=5858',
        app: 'google-chrome'
      },
      platoReport: {
        path: './plato/index.html',
        app: 'google-chrome'
      }
    },
    plato: {
      src: {
        options: {
          jshint: grunt.file.readJSON('.jshintrc')
        },
        files: {
          'plato': ['lib/**/*.js']
        }
      }
    },
    eslint: {
      src: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    },
    mochaTest: {
      test: {
        src: ['lib/**/**/*-spec.js'],
        options: {
          reporter: 'Spec',
          logErrors: true,
          timeout: 5000,
          run: true
        }
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');

  // Testing tasks
  grunt.registerTask('test', ['shell:unit', 'shell:accept']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('unit', ['eslint', 'mocha']);

  grunt.registerTask('accept', ['env:local', 'shell:accept']);

  // Coverate tasks
  grunt.registerTask('coverage', ['shell:coverage_unit', 'shell:coverage_accept']);
  grunt.registerTask('coverage-unit', ['shell:coverage_unit']);
  grunt.registerTask('coverage-accept', ['env:local', 'shell:coverage_accept']);

  grunt.registerTask('analysis', ['plato:src', 'open:platoReport']);

  grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('debug', ['env:local', 'concurrent:debug']);
  grunt.registerTask('default', ['serve']);
};