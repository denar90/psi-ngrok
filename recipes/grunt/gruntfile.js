var psiNgrok = require('../../index');

module.exports = function(grunt) {

  grunt.file.setBase('../../');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'recipes/grunt/public'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('pagespeed', function() {
    var async = this.async;

    grunt.event.once('connect.server.listening', function(host, port) {
      psiNgrok({
        port: port,
        pages: ['index.html', 'slow.html'],
        onError: function(error) {
          grunt.fatal(error);
        },
        options: {
          threshold: 80
        }
      }).then(async());
    });
  });

  grunt.registerTask('default', ['pagespeed', 'connect:server:keepalive']);
};