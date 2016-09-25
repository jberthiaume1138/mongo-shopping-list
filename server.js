require('./db/connect');
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', itemRoutes);
app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

exports.app = app;
