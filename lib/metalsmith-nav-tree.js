(function () {
    'use strict';

    /**
     * Creates the navigation tree.
     */
    var _;

    _ = require('lodash');

    module.exports = function (options) {
        var defaults,
            settings;

        // Add fields from the file data.
        function addFieldsFromFile(node, file) {
            settings.includeFileFields.forEach(function (field) {
                if (file.hasOwnProperty(field)) {
                    node[field] = file[field];
                }
            });
            return node;
        }

        // Create the navigation tree structure.
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
                        uri: '#' + heading.id,
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

                    node = addFieldsFromFile({
                        children: [],
                        headings: [],
                        level: level,
                        path: file.path
                    }, file);

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
                            node.children.push(
                                addFieldsFromFile({
                                    children: [],
                                    headings: files[y].headings,
                                    path: files[y].path
                                }, files[y])
                            );

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

                    node.uri = node.path.href;
                    delete node.path;
                    branch.push(node);
                }

                return branch;
            };

            level = 0;

            return makeBranch(files);
        }

        defaults = {
            includeFileFields: ['title']
        };
        settings = _.merge({}, defaults, options);

        return function (files, metalsmith, next) {
            var k;
            for (k in files) {
                files[k].navigation = {
                    tree: makeTree(files, files[k])
                };
            }
            next();
        };
    };
}());
