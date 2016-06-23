(function () {
    'use strict';

    function makeBreadcrumb(tree) {
        // Add the home page to the tree.
        // tree.push({
        //     href: files['index.html'].path.href,
        //     title: files['index.html'].title
        // });
        //
        // // Remove the home page.
        // delete files['index.html'];
        return clone(tree);
    }

    function makeHeader(tree) {
        return clone(tree);
    }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            var data,
                k;

            data = metalsmith.metadata();

            for (k in files) {
                files[k].navigation.patterns = {
                    header: makeHeader(data.navigation.tree)
                };
            }

            next();
        };
    };
}());
