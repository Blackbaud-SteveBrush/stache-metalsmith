/**
 * Inspired by https://github.com/losttype/metalsmith-register-helpers
 */
(function () {
    'use strict';

    var extend,
        fs,
        Handlebars;

    extend = require('extend');
    fs = require('fs');
    Handlebars = require('handlebars');

    module.exports = function (options) {
        options = extend({
            directory: 'helpers'
        }, options || {});

        return function (files, metalsmith, done) {

            fs.readdir(metalsmith.path(options.directory), function (error, files) {
                if (error) {
                    throw error;
                }

                files.forEach(function (file) {
                    var helperContents,
                        path,
                        templateName;

                    path = metalsmith.path(options.directory, file);
                    helperContents = require(path);

                    switch (typeof helperContents) {
                    case 'function':
                        templateName = file.split('.').shift();
                        Handlebars.registerHelper(templateName, helperContents);
                        break;
                    case 'object':
                        Handlebars.registerHelper(helperContents);
                        break;
                    }
                });

                done();
            });
        };
    };

}());
