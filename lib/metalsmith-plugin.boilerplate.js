(function () {
    'use strict';

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            next();
        };
    };
}());
