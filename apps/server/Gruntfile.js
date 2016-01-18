module.exports = function (grunt) {
  grunt.initConfig({
    concurrent: {
      target: ['node-inspector', 'nodemon'],
      options: {
        logConcurrentOutput: true
      }
    },
    'node-inspector': {
      dev: {}
    },
    nodemon: {
      all: {
        script: 'app.js',
        options: {
          ignored: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js', 'json'],
          watchedFolders: ['test', 'app'],
          delayTime: 1,
          nostdin: true,
          legacyWatch: true,
          nodeArgs: ['--debug'],
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });
          }
        }
      },
      none: {}
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
        rulePaths: ['']
      },
      all: {
        src: ['app/']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['force:eslint', 'concurrent:target']);

};
