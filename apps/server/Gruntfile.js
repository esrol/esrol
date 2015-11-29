module.exports = function (grunt) {
  grunt.initConfig({
    'node-inspector': {
      dev: {}
    },
    nodemon: {
      all: {
        script: 'server.js',
        options: {
          ignored: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js', 'md'],
          watchedFolders: ['test', 'tasks'],
          delayTime: 1,
          nostdin: true,
          exitcrash: true,
          legacyWatch: true,
          env: {
            PORT: '8181'
          },
          args: ['production'],
          nodeArgs: ['--debug'],
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });
            nodemon.on('config:update', function(event) {
              // console.log('custom logging');
              // console.log(event);
            });
          }
        }
      },
      none: {
        script: 'test/fixtures/server.js',
      }
    },
    jshint: {
      options: {
        bitwise: true,
        indent: 20,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        quotmark: 'single',
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        trailing: true,
        eqnull: true,
        node: true,
        expr: true,
        evil: true,
        globals: {
          describe: false,
          it: false,
          before: false
        }
      },
      files: {
        src:  ['*.js', 'test/*.js', 'tasks/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-node-inspector');

  // grunt.loadNpmTasks('grunt-node-inspector');

  // grunt.registerTask('default', ['node-inspector']);
  grunt.registerTask('default', ['node-inspector', 'force:jshint', 'nodemon']);
  // grunt.registerTask('test', ['jshint']);


};