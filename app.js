var express = require('express'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Prestige = require('./lib/prestige');

(function(){
  "use strict";

  app.use(logger('combined'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  var prestige = new Prestige(app, 'config/prestige.json');

  app.listen(3000);

})();
