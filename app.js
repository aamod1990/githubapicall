var express 	 = require('express');
var app 		 = express();
var bodyParser   = require('body-parser');
var path         = require('path');
var middleware   = require('./config/initializers/middleware.js');
require('dotenv').config()

app.use(bodyParser.json());
//load our routes and pass in our app and fully configured passport
require('./config/routes.js')(app);
//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
// error hndlers
app.use(middleware.pageNotFound);
app.use(middleware.internalServerError);
app.use(middleware.requestTimeOut);
module.exports = app;