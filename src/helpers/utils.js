(function () {
    'use strict';

    module.exports = {
        join: function (context, delimiter) {
            return '"' + context.join('"' + delimiter + '"') + '"';
        },
        json: function (context) {
            return '<pre>' + JSON.stringify(context, null, '    ') + '</pre>';
        }
    };
}());
