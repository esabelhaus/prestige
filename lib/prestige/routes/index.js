var express = require('express'),
    router = express.Router(),
    tracking = require('../tracking'),
    ci = require('../ci'),
    nconf = require('nconf');

(function(){
  "use strict";
  module.exports = function(configFile) {
    nconf.file({ file: configFile });
    var tracking_config = nconf.get('prestidigitation:tracking');
    var ci_config = nconf.get('prestidigitation:ci');

    //handle requests from source control
    router.post('/sc/tracking', function(request, response) {
      var project = request.query.project;
      var key = request.query.key;
      var postCommit = request.body;
      tracking_config.reqUri = request.protocol + '://' + request.get('host');
      tracking.updateIssue(tracking_config, project, postCommit, key, function(res, err) {
        if (!err) {
          console.log("Attempting Issue Update");
          response.writeHead(200);
          response.end("Attempting Issue Update!\n" + res);
        } else {
          console.log("ERROR: " +err);
          response.writeHead(500);
          response.end("ERROR: " + err);
        }
      });
    });

    router.post('/sc/ci', function(request, response) {
      var job = request.query.job;
      var key = request.query.key;
      var postCommit = request.body;

      ci.startBuild(ci_config, postCommit, job, key, function(res, err) {
        if (!err) {
          console.log("Attempting Build");
          response.writeHead(200);
          response.end("Attempting CI Build!\n" + res);
        } else {
          console.log("ERROR: " +err);
          response.writeHead(500);
          response.end("ERROR: " + err);
        }
      });
    });

    return router;
  };
})();
