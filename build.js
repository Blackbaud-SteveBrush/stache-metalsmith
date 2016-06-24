(function () {
    'use strict';

    var assets,
        config,
        dir,
        friendlyTemplateNames,
        headings,
        helpers,
        inPlaceTemplating,
        markdown,
        metalsmith,
        metalsmithExpress,
        navPatterns,
        navTree,
        paths,
        templates,
        templatesConfig;

    dir = {
        base: __dirname + '/',
        lib: __dirname + '/lib/',
        source: './src/',
        dest: './build/'
    };

    templatesConfig = {
        engine: 'handlebars',
        directory: dir.source + 'templates/',
        partials: dir.source + 'partials/',
        default: 'layout-sidebar.html'
    };

    config = require(dir.lib + 'metalsmith-config');
    metalsmith = require('metalsmith');
    metalsmithExpress = require('metalsmith-express');
    markdown = require('metalsmith-markdown');
    templates = require('metalsmith-layouts');
    helpers = require(dir.lib + 'metalsmith-register-helpers');
    friendlyTemplateNames = require(dir.lib + 'metalsmith-friendly-template-names');
    assets = require(dir.lib + 'metalsmith-assets');
    headings = require('metalsmith-headings');
    paths = require('metalsmith-paths');
    inPlaceTemplating = require('metalsmith-in-place');
    navPatterns = require(dir.lib + 'metalsmith-nav-patterns');
    navTree = require(dir.lib + 'metalsmith-nav-tree');

    metalsmith(dir.base)
        .clean(true)
        .source(dir.source + 'content/')
        .destination(dir.dest)
        .use(config({
            files: {
                stache: 'stache.yml'
            }
        }))
        .use(assets({
            src: ['./src/assets/js/'],
            dest: dir.dest + 'js/'
        }))
        .use(helpers({
            directory: 'src/helpers'
        }))
        .use(markdown())
        .use(headings('h2'))
        .use(paths({
            directoryIndex: "index.html"
        }))
        .use(navTree())
        .use(navPatterns())
        .use(inPlaceTemplating(templatesConfig))
        .use(friendlyTemplateNames())
        .use(templates(templatesConfig))
        .use(metalsmithExpress())
        .build(function(err) {
            if (err) {
                throw err;
            }
        });
}());
