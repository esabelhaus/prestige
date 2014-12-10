var express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    nconf = require('nconf'),
    routes = require('./routes/index');


(function(){
  "use strict";

nconf.file({ file: 'config/app.json' });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

module.exports = app;

app.listen(nconf.get('config:port'));


})();
