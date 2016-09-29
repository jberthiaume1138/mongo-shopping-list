var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.delete = function (id, callback, errback) {
    Item.findOneAndRemove({_id: id}, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.update = function (id, name, status, callback, errback) {
    var options = { new: true };
    var updates = { $set: {name: name, status: status} };
    Item.findOneAndUpdate({_id: id}, updates, options, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};
