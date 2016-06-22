(function () {
    'use strict';

    module.exports = {
        json: function (context) {
            return '<pre>' + JSON.stringify(context, null, ' ') + '</pre>';
        }
    };
}());
