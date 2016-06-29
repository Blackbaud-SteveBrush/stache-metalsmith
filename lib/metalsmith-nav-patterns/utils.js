(function () {
    'use strict';

    function mixin(destination, source) {
        var k;

        for (k in source.prototype) {
            if (destination.prototype.hasOwnProperty(k) === false) {
                destination.prototype[k] = source.prototype[k];
            } else {
                console.log("ERROR: Mixin " + k + " already exists!");
            }
        }

        // Add static methods.
        if (source.static) {
            destination.static = destination.static || {};
            for (k in source.static) {
                if (source.static.hasOwnProperty(k)) {
                    destination.static[k] = source.static[k];
                }
            }
        }
    }

    module.exports = {
        mixin: mixin
    };
}());
