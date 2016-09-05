require('./db/connect');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var app = express();

app.use(bodyParser.json());
// app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,'/public')));

app.use('/', itemRoutes);

app.get('/', function(req, res) {
    res.render('home');
});

app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Listening on port' + port);
});

exports.app = app;
