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

    function getFileContents(fileName) {
        var contents,
            json;

        fileName = path.normalize(fileName);

        try {

            // First, get the baseline data.
            contents = fs.readFileSync(fileName, 'utf8');
            json = yaml.safeLoad(contents);

            // Then, compile the lodash templates.
            contents = _.template(contents)(json);
            contents = yaml.safeLoad(contents);
            return contents;

        } catch (error) {
            console.log("Config file not found:", error);
        }
    }

    module.exports = function (options) {
        options = options || {};
        return function (sourceFiles, metalsmith, next) {
            var fileName,
                files,
                k,
                metadata,
                processFilename;

            processFilename = function (file) {
                metadata.config[k] = _.merge(metadata.config[k] || {}, getFileContents(file));
            };

            files = options.files;
            metadata = metalsmith.metadata();
            metadata.config = {};

            for (k in files) {
                fileName = files[k];
                if (_.isArray(fileName)) {
                    fileName.forEach(processFilename);
                } else {
                    processFilename(fileName);
                }
            }
            next();
        };
    };
}());
