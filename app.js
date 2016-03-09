var express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Prestige = require('./lib/prestige');

(function(){
  "use strict";

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  var prestige = new Prestige(app, 'config/prestige.json');

  app.get('/', function(req, res) {
    res.send('Abracadabra!');
  });

  app.listen(3001);

})();
