var express = require('express'),
    router = express.Router(),
    tracking = require('../tracking'),
    sc = require('../sc'),
    ci = require('../ci'),
    nconf = require('nconf');

(function(){
  "use strict";

  nconf.file({ file: 'config/prestige.json' });
  var tracking_config = nconf.get('prestidigitation:tracking');
  var sc_config = nconf.get('prestidigitation:sc');
  var ci_config = nconf.get('prestidigitation:ci');

  //handle requests from source control
  router.post('/sc/tracking/:project/:key', function(request, response) {
    var project = request.params.project;
    var key = request.params.key;
    var postCommit = request.body;

    tracking.updateIssue(tracking_config, project, postCommit, key, function(res, err) {
      if (!err) {
        console.log(res);
        response.writeHead(200);
        response.end("Got it!");
      } else {
        console.log(err);
        response.writeHead(500);
        response.end("ERROR: " + err);
      }
    });
  });

  router.post('/sc/ci/:job/:key', function(req, response) {
    var job = request.params.job;
    var key = request.params.key;
    var postCommit = request.body;

    ci.startBuild(ci_config, postCommit, job, key, function(res, err) {
      if (!err) {
        console.log(res);
        response.writeHead(200);
        response.end("Got it!");
      } else {
        console.log(err);
        response.writeHead(500);
        response.end("ERROR: " + err);
      }
    });
  });

  //handle requests from issue tracking
  //router.post('/tracking/:project/:key', function(request, response) {

  //});

  //handle request from continuous integration
  //router.post('/ci/:project/:key', function(request, response) {

  //});

  module.exports = router;

})();
