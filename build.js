(function () {
    'use strict';

    var assets,
        beautify,
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
        content: '../../content/',
        lib: './lib/',
        source: './src/',
        dest: '../../build/'
    };

    templatesConfig = {
        engine: 'handlebars',
        directory: dir.source + 'templates/',
        partials: dir.source + 'partials/',
        default: 'layout-sidebar.html'
    };

    config = require(dir.lib + 'metalsmith-config');
    helpers = require(dir.lib + 'metalsmith-register-helpers');
    friendlyTemplateNames = require(dir.lib + 'metalsmith-friendly-template-names');
    assets = require(dir.lib + 'metalsmith-assets');
    navPatterns = require(dir.lib + 'metalsmith-nav-patterns');
    navTree = require(dir.lib + 'metalsmith-nav-tree');

    metalsmith = require('metalsmith');
    metalsmithExpress = require('metalsmith-express');
    markdown = require('metalsmith-markdown');
    templates = require('metalsmith-layouts');
    headings = require('metalsmith-headings');
    paths = require('metalsmith-paths');
    inPlaceTemplating = require('metalsmith-in-place');
    beautify = require('metalsmith-beautify');

    module.exports = function (callback) {
        var ms;

        ms = metalsmith(dir.base);
        ms.clean(true);
        ms.source(dir.content);
        ms.destination(dir.dest);

        ms.use(config({
            files: {
                stache: [
                    'node_modules/blackbaud-stache/stache.yml',
                    'stache.yml'
                ]
            }
        }));

        // Asset arrays
        ms.use(assets({
            src: [
                'node_modules/blackbaud-stache/src/assets/dist/js/',
                'node_modules/blackbaud-stache/src/assets/dist/css/'
            ],
            dest: 'build/'
        }));

        // Handlebars
        ms.use(helpers({
            directory: 'src/helpers'
        }));

        // Engine.
        ms.use(markdown());

        // Navigation
        ms.use(headings('h2'));
        ms.use(paths({
            directoryIndex: 'index.html'
        }));
        ms.use(navTree());
        ms.use(navPatterns());

        // Templating
        ms.use(inPlaceTemplating(templatesConfig));
        ms.use(friendlyTemplateNames());
        ms.use(templates(templatesConfig));
        ms.use(beautify({
            'indent_size': 2,
            'indent_char': ' ',
            'preserve_newlines': true,
            'end_with_newline': true,
            "jslint_happy": true,
            'css': false,
            'js': false
        }));

        // Server
        ms.use(metalsmithExpress({
            liveReload: false
        }));

        ms.build(function(err) {
            if (err) {
                throw err;
            }
        });
    };
}());
