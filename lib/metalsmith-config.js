/**
 * Inspired by:
 *   - https://github.com/segmentio/metalsmith-metadata
 *   - https://github.com/JemBijoux/metalsmith-metadata
 */
(function () {
    'use strict';

    var fs,
        yaml,
        path;

    fs = require('fs');
    yaml = require('js-yaml');
    path = require('path');

    module.exports = function (options) {
        options = options || {};
        return function (sourceFiles, metalsmith, next) {
            var contents,
                fileName,
                files,
                k,
                metadata;

            files = options.files;
            metadata = metalsmith.metadata();
            metadata.config = {};

            for (k in files) {
                fileName = files[k];
                fileName = path.normalize(fileName);
                try {
                    contents = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
                    metadata.config[k] = contents;
                } catch (error) {
                    console.log("Config file not found:", fileName);
                }
            }
            next();
        };
    };
}());
