(function () {
    'use strict';

    var PatternGenerator,
        utils;

    PatternGenerator = require(__dirname + 'generator');
    utils = require('../utils');

    function PatternSidebar() {}

    utils.mixin(PatternSidebar, PatternGenerator);

    module.exports = function (options) {
        return new PatternSidebar(options);
    };
}());
