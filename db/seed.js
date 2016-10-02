var Item = require('../models/item');

exports.run = function(callback, errback) {
    Item.create({name: 'Broad beans', status: true},
                {name: 'Tomatoes', status: false},
                {name: 'Peppers', status: true},
                 function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

if (require.main === module) {
    require('./connect');
    exports.run(function() {
        var mongoose = require('mongoose');
        mongoose.disconnect();
    }, function(err) {
        console.error(err);
    });
}
