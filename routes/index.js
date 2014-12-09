var express = require('express'),
    router = express.Router(),
    https = require('https'),
    tracking = require('../app/tracking'),
    sc = require('../app/sc'),
    ci = require('../app/ci'),
    nconf = require('nconf');

(function(){
  "use strict";

  nconf.file({ file: 'config/prestige.json' });
  var tracking_config = nconf.get('prestidigitation:tracking');
  var sc_config = nconf.get('prestidigitation:sc');
  var ci_config = nconf.get('prestidigitation:ci');

  //handle requests from source control
  router.post('/sc/:task/:project/:key/:user', function(req, res) {
    var project = req.params.project;
    var key = req.params.key;
    var task = req.params.task;
    var user = req.params.user;
    var postCommit = req.body;

    if (task === "tracking") {
      tracking.updateIssue(tracking_config, project, postCommit, key, function(res, err) {
        if (!err) {
          console.log(res);
        } else {
          console.log(err);
        }
      });
    } else if (task === "ci") {
      
    }

    res.writeHead(200);
    res.end("Got it!");
  });

  //handle requests from issue tracking
  router.post('/tracking/:project/:key', function(req, res) {

  });

  //handle request from continuous integration
  router.post('/ci/:project/:key', function(req,res) {

  });

  module.exports = router;

})();
