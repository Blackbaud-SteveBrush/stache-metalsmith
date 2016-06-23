(function () {
    'use strict';

    //var tree;

    /**
     * Creates the navigation tree.
     */

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function makeTree(files, current) {
        return makeBranch(clone(files), current);
    }

    function makeBranch(files, current) {
        var branch,
            file,
            node,
            x,
            y;

        branch = [];

        for (x in files) {
            file = files[x];

            // Only check a given file once.
            if (file.skip) {
                continue;
            }

            node = {
                path: file.path,
                title: file.title,
                children: []
            };

            if (file.path.href === current.path.href) {
                node.current = true;
                node.active = true;
            }

            for (y in files) {

                // Don't check against the home page.
                if (file.path.href === '/') {
                    continue;
                }

                // Don't check against the same file.
                if (files[y].path.href === file.path.href) {
                    continue;
                }

                // This file is a child of the parent file.
                if (files[y].path.href.indexOf(file.path.href) === 0) {
                    node.active = true;
                    node.children.push({
                        active: true,
                        path: files[y].path,
                        title: files[y].title,
                        children: []
                    });
                    files[y].skip = true;
                }
            }

            // This file has children, so recursively add branches.
            if (node.children.length > 0) {
                node.children = makeBranch(node.children, current);
            }

            node.href = node.path.href;
            delete node.path;

            branch.push(node);
        }

        return branch;
    }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            var data;

            data = metalsmith.metadata();
            data.navigation = data.navigation || {};
            data.navigation.tree = makeTree(files);

            next();
        };
    };
}());