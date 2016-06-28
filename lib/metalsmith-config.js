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

    function getFileContents(filePath) {
        var contents,
            json;

        filePath = path.normalize(filePath);

        try {

            // First, get the baseline data.
            contents = fs.readFileSync(filePath, 'utf8');
            json = yaml.safeLoad(contents);

            // Then, compile the lodash templates.
            contents = _.template(contents)(json);
            contents = yaml.safeLoad(contents);
            return contents;

        } catch (error) {
            console.log("Config file not found:", error);
        }
    }

    function mergeFileContents(files) {
        var data;
        data = {};
        if (_.isArray(files)) {
            files.forEach(function (file) {
                data = _.merge(data, getFileContents(file));
            });
        } else {
            data = getFileContents(files);
        }
        return data;
    }

    module.exports = function (options) {
        options = options || {};
        return function (sourceFiles, metalsmith, next) {
            var metadata;

            metadata = metalsmith.metadata();
            metadata.config = {};

            Object.keys(options).forEach(function (key) {
                metadata.config[key] = mergeFileContents(options[key]);
            });

            next();
        };
    };
}());
