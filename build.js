(function () {
    'use strict';

    var assets,
        browserSync,
        config,
        dir,
        headings,
        helpers,
        inPlaceTemplating,
        markdown,
        metalsmith,
        navigation,
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
        default: 'page.html'
    };

    browserSync = require('metalsmith-browser-sync');
    config = require(dir.lib + 'metalsmith-config');
    metalsmith = require('metalsmith');
    markdown = require('metalsmith-markdown');
    templates = require('metalsmith-layouts');
    helpers = require(dir.lib + 'metalsmith-register-helpers');
    assets = require(dir.lib + 'metalsmith-assets');
    headings = require('metalsmith-headings');
    paths = require('metalsmith-paths');
    inPlaceTemplating = require('metalsmith-in-place');
    navigation = require(dir.lib + 'metalsmith-nav-tree');

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
        .use(navigation())
        .use(inPlaceTemplating(templatesConfig))
        .use(templates(templatesConfig))
        .use(browserSync({
            server: dir.dest,
            files: [dir.source + '**/*']
        }))
        .build(function(err) {
            if (err) {
                throw err;
            }
        });
}());
