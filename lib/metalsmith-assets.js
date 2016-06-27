(function () {
    'use strict';

    var fse,
        path;

    fse = require('fs-extra');
    path = require('path');

    function copyFile(file) {
        fse.copySync(path.normalize(file.src), path.normalize(file.dest));
    }


    /**
     * Adds JS/CSS files (and their locations) to metadata.
     */
    module.exports = function (options) {
        options = options || {};
        return function (sourceFiles, metalsmith, next) {
            var k,
                metadata;

            metadata = metalsmith.metadata();
            metadata.assets = {};

            try {
                options.src.forEach(function (loc) {
                    var files;
                    files = fse.readdirSync(path.normalize(loc));
                    files.forEach(function (file) {
                        var ext;
                        ext = file.split('.').pop();
                        metadata.assets[ext] = metadata.assets[ext] || [];
                        metadata.assets[ext].push({
                            src: path.join(loc, file),
                            dest: path.join(options.dest, ext, file),
                            url: metadata.config.stache.path[ext] + file
                        });
                    });
                });
                for (k in metadata.assets) {
                    metadata.assets[k].forEach(copyFile);
                }
            } catch (error) {
                throw error;
            }

            next();
        };
    };
}());
