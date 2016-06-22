/**
 * Inspired by:
 *   - https://github.com/segmentio/metalsmith-metadata
 *   - https://github.com/JemBijoux/metalsmith-metadata
 */
(function () {
    'use strict';

    var _,
        fs,
        yaml,
        path;

    _ = require('lodash');
    fs = require('fs');
    yaml = require('js-yaml');
    path = require('path');

    module.exports = function (options) {
        options = options || {};
        return function (sourceFiles, metalsmith, next) {
            var contents,
                fileName,
                files,
                json,
                k,
                metadata;

            files = options.files;
            metadata = metalsmith.metadata();
            metadata.config = {};

            for (k in files) {
                fileName = files[k];
                fileName = path.normalize(fileName);
                try {

                    // First, get the baseline data.
                    contents = fs.readFileSync(fileName, 'utf8');
                    json = yaml.safeLoad(contents);

                    // Then, compile the lodash templates.
                    contents = _.template(contents)(json);
                    metadata.config[k] = yaml.safeLoad(contents);

                } catch (error) {
                    console.log("Config file not found:", fileName);
                }
            }
            next();
        };
    };
}());
