(function () {
    'use strict';

    //var tree;

    /**
     * Creates the navigation tree.
     */
    var _;

    _ = require('lodash');

    function makeTree(files, current) {
        var level,
            makeBranch;

        makeBranch = function (files) {
            var addHeading,
                branch,
                file,
                node,
                x,
                y;

            addHeading = function (heading) {
                node.headings.push({
                    href: '#' + heading.id,
                    title: heading.text
                });
            };

            branch = [];
            ++level;

            for (x in files) {
                file = files[x];

                // Only check a given file once.
                if (file.skip) {
                    continue;
                }

                node = {
                    children: [],
                    headings: [],
                    level: level,
                    path: file.path,
                    title: file.title
                };

                // Check if file is current page.
                if (file.path.href === current.path.href) {
                    node.isCurrent = true;
                }

                // Check if file is an active page.
                if (file.path.href !== '/' && current.path.href.indexOf(file.path.href) === 0) {
                    node.isActive = true;
                }

                // Add files as children that fall in the directory heirarchy.
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
                        node.children.push({
                            path: files[y].path,
                            headings: files[y].headings,
                            title: files[y].title,
                            children: []
                        });

                        // This file doesn't need to be checked again.
                        files[y].skip = true;
                    }
                }

                // This file has children, so recursively add branches.
                if (node.children.length > 0) {
                    node.children = makeBranch(node.children);
                } else {
                    if (file.headings && file.path.href !== '/') {
                        file.headings.forEach(addHeading);
                    }
                }

                node.href = node.path.href;
                //delete node.headings;
                delete node.path;

                branch.push(node);
            }

            return branch;
        };

        level = 0;

        return makeBranch(files);
    }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            for (var k in files) {
                files[k].navigation = {
                    tree: makeTree(files, files[k])
                };
            }
            next();
        };
    };
}());
