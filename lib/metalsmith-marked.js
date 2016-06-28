/**
 * Inspired by:
 * https://github.com/segmentio/metalsmith-markdown
 */
(function () {
    'use strict';

    var marked,
        path;

    marked = require('marked');
    path = require('path');

    function isMarkdownFile(fileName) {
        return (path.extname(fileName) === '.md');
    }

    module.exports = function (options) {
        options = options || {};
        return function (files, metalsmith, next) {
            Object.keys(files).forEach(function (fileName) {
                var content,
                    htmlFile,
                    markdownString,
                    tokens;

                if (!isMarkdownFile(fileName)) {
                    return;
                }

                markdownString = files[fileName].contents.toString();

                if (typeof options.onBeforeEach === 'function') {
                    tokens = marked.lexer(markdownString, options);
                    options.onBeforeEach.call({}, tokens);
                    content = marked.parser(tokens);
                } else {
                    content = marked(markdownString, options);
                }

                if (typeof options.onAfterEach === 'function') {
                    content = options.onAfterEach.call({}, content);
                }

                htmlFile = path.join(path.dirname(fileName), path.basename(fileName, path.extname(fileName)) + '.html');

                files[fileName].contents = new Buffer(content);
                files[htmlFile] = files[fileName];
                delete files[fileName];
            });
            next();
        };
    };
}());
