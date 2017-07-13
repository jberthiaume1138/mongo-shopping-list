var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        "default": false
    }
});

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    items: {
        ItemSchema
    }
});

var Item = mongoose.model('Item', ItemSchema);

var User = mongoose.model('User', UserSchema);

module.exports = Item;
