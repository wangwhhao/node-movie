var express = require('express');
var path = require('path');
var mongoose = require("mongoose");

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var morgan = require('morgan');

var port = process.env.PORT || 3000;
var app = express();
var dbUrl = "mongodb://localhost/node_project";

mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(serveStatic('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret:'nodemovie',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));
app.locals.moment = require("moment");

if('development' === app.get('env')){
	app.set('showStackError',true);
	app.use(morgan('dev'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

require('./config/routes')(app);

app.listen(port);

console.log('node_project started on port' + port);

