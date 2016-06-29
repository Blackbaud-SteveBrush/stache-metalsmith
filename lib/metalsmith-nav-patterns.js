(function () {
    'use strict';

    var _;

    _ = require('lodash');

    /**
     * Removes all children from an object's children.
     * Most likely, the object will be an inactive branch.
     */
    function removeGrandchildren(obj) {
        if (!_.isArray(obj.children.items)) {
            return;
        }
        obj.children.items.forEach(function (item) {
            delete item.children;
            delete item.headings;
        });
    }

    function setupBranches(arr, classname) {
        if (!_.isArray(arr)) {
            return;
        }
        arr.forEach(function (item) {

            // Navigation
            if (item.children && item.children.length) {
                item.children = {
                    classname: classname,
                    items: _.cloneDeep(item.children)
                };
                setupBranches(item.children.items, classname);
            }

            // Headings
            if (item.headings && item.headings.length) {
                item.headings = {
                    classname: classname,
                    items: _.cloneDeep(item.headings)
                };
            }
        });
    }

    function makeBreadcrumbs(tree) {
        var findBreadcrumb,
            menu;

        findBreadcrumb = function (branch) {
            branch.forEach(function (item, i) {
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
        tree = _.cloneDeep(tree);

        // Add the home page.
        menu.push(tree[0]);

        // Add everything else.
        findBreadcrumb(tree);

        // Remove any children
        menu.forEach(function (item) {
            delete item.children;
        });

        return {
            classname: 'breadcrumb',
            items: menu
        };
    }

    function makeFooter(tree) {
        var menu;

        menu = [];
        tree = _.cloneDeep(tree);

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
        tree = _.cloneDeep(tree);

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
            removeGrandchildren(branch);
            menu.push(branch);
        });

        return {
            classname: 'nav navbar-nav',
            items: menu
        };
    }

    // function makePanels(tree) {
    //     var panels;
    //
    //     panels = {
    //         items: []
    //     };
    //     tree = _.cloneDeep(tree);
    //
    //     if (!_.isArray(tree.items)) {
    //         return panels;
    //     }
    //
    //     tree.items.forEach(function (item) {
    //         item.content = item.description || '';
    //         delete item.description;
    //         delete item.level;
    //         panels.items.push(item);
    //     });
    //
    //     return panels;
    // }

    function makePanels(tree) {
        var currentBranch,
            findCurrentBranch;

        findCurrentBranch = function (tree) {
            var branch,
                i,
                len;

            if (!_.isArray(tree)) {
                return false;
            }

            i = 0;
            len = tree.length;

            for (; i < len; ++i) {
                branch = tree[i];
                if (branch.isActive) {
                    if (branch.isCurrent) {
                        return branch;
                    }
                    if (branch.children.items.length) {
                        return findCurrentBranch(branch.children.items);
                    }
                }
            }

            return false;
        };

        tree = _.cloneDeep(tree);
        setupBranches(tree, 'stache-panels');
        currentBranch = findCurrentBranch(tree);

        if (currentBranch) {
            if (!currentBranch.children.items) {
                return [];
            }

            currentBranch.children.items.forEach(function (item) {
                item.content = item.description || '';
                delete item.description;
                delete item.children;
                delete item.headings;
                delete item.level;
            });

            return currentBranch.children;
        }

        return [];
    }

    function makeSidebar(tree) {
        var breadcrumb,
            findCurrentBranch,
            menu;

        findCurrentBranch = function (arr) {
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
                            findCurrentBranch(branch.children.items);
                        }
                    }
                } else {
                    // Only children of active parents should be displayed,
                    // so let's just remove their children.
                    delete branch.children;
                    delete branch.headings;
                }
            });
        };

        menu = [];
        breadcrumb = [];
        tree = _.cloneDeep(tree);
        setupBranches(tree, 'nav');
        findCurrentBranch(tree);

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
                    breadcrumbs: makeBreadcrumbs(tree),
                    footer: makeFooter(tree),
                    header: makeHeader(tree),
                    panels: makePanels(tree),
                    sidebar: makeSidebar(tree)
                };
            }

            next();
        };
    };
}());
