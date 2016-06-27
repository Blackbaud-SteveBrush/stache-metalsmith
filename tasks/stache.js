(function () {
    'use strict';

    module.exports = function (grunt) {
        var stacheMetalsmith,
            tasks;

        stacheMetalsmith = require('../build');

        tasks = {

            // Masks `grunt` command with `stache`.
            stache: function (optionalTask) {
                var key,
                    task;
                key = '_tasks';
                task = optionalTask || 'help';
                if (grunt.task[key][task]) {
                    grunt.task.run(task);
                } else {
                    grunt.fail.fatal('Unknown command requested: ' + task);
                }
            },

            stacheServe: function (context) {
                stacheMetalsmith(this.async());
            }
        };


        grunt.registerTask('stache', tasks.stache);
        grunt.registerTask('serve', 'Serve the documentation', tasks.stacheServe);
    };
}());
