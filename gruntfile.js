(function () {
    'use strict';

    module.exports = function (grunt) {
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-sass');

        grunt.initConfig({
            globalConfig: {
                path: {
                    assets: 'src/assets/',
                    dist: '<%= globalConfig.path.assets %>dist/'
                }
            },
            sass: {
                options: {
                    outputStyle: 'compressed',
                    includePaths: [
                        'bower_components/'
                    ]
                },
                build: {
                    files: [{
                        expand: true,
                        cwd: '<%= globalConfig.path.assets %>sass',
                        src: ['*.scss'],
                        dest: '<%= globalConfig.path.dist %>css',
                        ext: '.css'
                    }]
                }
            },
            uglify: {
                build: {
                    files: {
                        '<%= globalConfig.path.dist %>js/stache.min.js': [
                            '<%= globalConfig.path.assets %>scripts/stache-app.js'
                        ]
                    }
                }
            },
        });

        grunt.registerTask('build', [
            'sass',
            'uglify:build'
        ]);
    };
}());
