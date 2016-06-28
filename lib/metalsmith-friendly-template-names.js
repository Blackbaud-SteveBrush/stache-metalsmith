(function () {
    'use strict';

    /**
     * Lets consumers type the layout name without the extension.
     */
    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            var layoutFile,
                k;
            for (k in files) {
                layoutFile = files[k].layout;
                if (!layoutFile) {
                    continue;
                }
                if (layoutFile.indexOf('.html') === -1) {
                    files[k].layout = layoutFile + '.html';
                }
            }
            next();
        };
    };
}());
