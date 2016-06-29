(function () {
    'use strict';

    var _;

    _ = require('lodash');

    /**
     * Removes all children from an object's children.
     * Most likely, the object will be an inactive branch.
     */
    // function removeGrandchildren(obj) {
    //     if (!_.isArray(obj.children.items)) {
    //         return;
    //     }
    //     obj.children.items.forEach(function (item) {
    //         delete item.children;
    //         delete item.headings;
    //     });
    // }
    //
    // function setupBranches(arr, classname) {
    //     if (!_.isArray(arr)) {
    //         return;
    //     }
    //     arr.forEach(function (item) {
    //
    //         // Navigation
    //         if (item.children && item.children.length) {
    //             item.children = {
    //                 classname: classname,
    //                 items: _.cloneDeep(item.children)
    //             };
    //             setupBranches(item.children.items, classname);
    //         }
    //
    //         // Headings
    //         if (item.headings && item.headings.length) {
    //             item.headings = {
    //                 classname: classname,
    //                 items: _.cloneDeep(item.headings)
    //             };
    //         }
    //     });
    // }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            var k,
                tree;

            var patternSidebar = require(__dirname + 'patterns/sidebar')(options);

            for (k in files) {
                tree = files[k].navigation.tree;
                files[k].navigation.patterns = {
                    sidebar: patternSidebar.generate(tree)
                };
            }

            next();
        };
    };
}());
