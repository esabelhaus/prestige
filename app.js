var express = require('express'),
    app = express(),
    http = require('http'),
    https = require('https'),
    forceSSL = require('express-force-ssl'),
    path = require('path'),
    fs = require('fs'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    nconf = require('nconf'),
    routes = require('./routes/index');


(function(){
  "use strict";

nconf.file({ file: 'config/prestige.json' });

var server;

if (nconf.get('config:ssl:enabled') === true) {
  var ssl_options = {
    key: fs.readFileSync(nconf.get('config:ssl:ssl_client_key')),
    cert: fs.readFileSync(nconf.get('config:ssl:ssl_client_cert')),
    ca: fs.readFileSync(nconf.get('config:ssl:ssl_ca_cert'))
  }
  server = https.createServer(ssl_options, app);
} else {
  server = http.createServer(app);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

module.exports = app;

server.listen(nconf.get('config:port'));

})();
