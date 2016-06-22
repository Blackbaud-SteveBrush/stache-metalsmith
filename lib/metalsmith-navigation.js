(function () {
    'use strict';

    /**
     * Creates the navigation tree.
     */
    function makeTree(files) {
        var tree;

        tree = [];

        files = JSON.parse(JSON.stringify(files));

        // Add the home page to the tree.
        tree.push({
            href: files['index.html'].path.href,
            title: files['index.html'].title
        });

        // Remove the home page.
        delete files['index.html'];

        // Add all branches to the home page.
        tree[0].children = makeBranch(files);

        return tree;
    }

    function makeBranch(files) {
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

            for (y in files) {

                // Don't check against the same file.
                if (files[y].path.href === file.path.href) {
                    continue;
                }
                // This file is a child of the parent file.
                if (files[y].path.href.indexOf(file.path.href) === 0) {
                    node.children.push({
                        path: files[y].path,
                        title: files[y].title,
                        children: []
                    });
                    files[y].skip = true;
                }
            }

            // This file has children, so recursively add branches.
            if (node.children.length > 0) {
                node.children = makeBranch(node.children);
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
            var data = metalsmith.metadata();
            data.navigation = data.navigation || {};
            data.navigation.tree = makeTree(files);
            next();
        };
    };
}());
