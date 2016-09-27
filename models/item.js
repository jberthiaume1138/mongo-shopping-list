var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Boolean, "default": false}
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
