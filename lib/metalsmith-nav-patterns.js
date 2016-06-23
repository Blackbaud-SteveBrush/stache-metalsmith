(function () {
    'use strict';

    var _;

    _ = require('lodash');

    /**
     * Removes children from an object.
     * Most likely, the object will be an inactive branch.
     */
    function removeGrandchildren(obj) {
        if (!_.isArray(obj.children.items)) {
            return;
        }
        obj.children.items.forEach(function (item) {
            if (item.children && _.isArray(item.children.items)) {
                delete item.children;
            }
        });
    }

    function setupBranches(arr, classname) {
        if (!_.isArray(arr)) {
            return;
        }
        arr.forEach(function (item) {
            if (item.children && item.children.length) {
                item.children = {
                    classname: classname,
                    items: _.cloneDeep(item.children)
                };
                setupBranches(item.children.items, classname);
            }
        });
    }

    function makeBreadcrumbs(tree) {
        var findBreadcrumb,
            menu;

        findBreadcrumb = function (branch) {
            branch.forEach(function (item) {
                if (item.isActive) {
                    menu.push(item);
                    if (item.isCurrent) {
                        item.classname = 'active';
                    } else if (item.children.length) {
                        findBreadcrumb(item.children);
                    }
                }
            });
        };

        menu = [];

        // Add the home page.
        menu.push(tree[0]);

        // Add everything else.
        findBreadcrumb(tree);

        return {
            classname: 'breadcrumb',
            items: menu
        };
    }

    function makeFooter(tree) {
        var menu;

        menu = [];

        tree.forEach(function (branch) {
            branch.classname = [];
            if (branch.isCurrent || branch.isActive) {
                branch.classname.push('active');
            }
            delete branch.children;
            branch.classname = branch.classname.join(' ');
            menu.push(branch);
        });
        return {
            classname: 'nav navbar-nav',
            items: menu
        };
    }

    function makeHeader(tree) {
        var menu;

        menu = [];

        setupBranches(tree, 'dropdown-menu');

        tree.forEach(function (branch) {
            branch.classname = [];
            if (branch.isCurrent || branch.isActive) {
                branch.classname.push('bb-navbar-active');
            }
            if (branch.children.items) {
                branch.classname.push('dropdown');
            }
            branch.classname = branch.classname.join(' ');
            menu.push(branch);
        });

        return {
            classname: 'nav navbar-nav',
            items: menu
        };
    }

    function makeSidebar(tree) {
        var breadcrumb,
            findCurrent,
            menu;

        findCurrent = function (arr) {
            arr.forEach(function (branch) {
                if (branch.isActive) {

                    // Add this active branch to the breadcrumb. We'll be using this
                    // for branches that are 3 or more levels deep.
                    breadcrumb.push(branch);

                    // We've reached the current page.
                    if (branch.isCurrent) {
                        branch.classname = 'current';

                        // Remove any grandchildren from the menu, since we won't
                        // want to display them just yet.
                        removeGrandchildren(branch);

                        switch (branch.level) {

                            // Top-level items.
                        case 1:
                            menu = branch.children.items;
                            break;

                            // Sub-page items.
                        case 2:
                            menu = arr;
                            break;

                            // All other levels...
                        default:

                            // We're pulling from the breadcrumb, so we need to setup the branches again.
                            setupBranches(breadcrumb[0].children.items, 'nav');

                            // Remove all grandchildren that exist below the current branch.
                            removeGrandchildren(breadcrumb[branch.level - 1]);
                            menu = breadcrumb[0].children.items;
                            break;
                        }
                    } else {
                        // Move to the next level down.
                        if (branch.children.items.length) {
                            findCurrent(branch.children.items);
                        }
                    }
                } else {
                    // Only children of active parents should be displayed,
                    // so let's just remove their children.
                    delete branch.children;
                }
            });
        };

        menu = [];
        breadcrumb = [];
        setupBranches(tree, 'nav');
        findCurrent(tree);

        return {
            classname: 'nav nav-stacked',
            items: menu
        };
    }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            var k,
                tree;

            for (k in files) {
                tree = files[k].navigation.tree;
                files[k].navigation.patterns = {
                    breadcrumbs: makeBreadcrumbs(_.cloneDeep(tree)),
                    footer: makeFooter(_.cloneDeep(tree)),
                    header: makeHeader(_.cloneDeep(tree)),
                    sidebar: makeSidebar(_.cloneDeep(tree))
                };
            }

            next();
        };
    };
}());
