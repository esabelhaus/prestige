var express = require('express'),
    router = express.Router(),
    tracking = require('../tracking'),
    ci = require('../ci');

(function(){
  "use strict";

  module.exports = function(nconf, log) {
    var tracking_config = nconf.get('prestidigitation:tracking');
    tracking_config.logger = log;

    var ci_config = nconf.get('prestidigitation:ci');
    ci_config.logger = log;

    //handle requests from source control
    router.post('/sc/tracking', function(request, response) {
      var project = request.query.project;
      var key = request.query.key;
      var postCommit = request.body;
      tracking_config.reqUri = request.protocol + '://' + request.get('host');

      log.info("Tracking: Attempting Issue Update");
      tracking.updateIssue(tracking_config, project, postCommit, key, function(res, err) {
        if (!err) {
          response.writeHead(200);
          response.end("Tracking: Attempting Issue Update!\n" + res);
        } else {
          log.error("Tracking: Error updating tracking issue", err);
          response.writeHead(500);
          response.end("ERROR: " + err);
        }
      });
    });

    router.post('/sc/ci', function(request, response) {
      var job = request.query.job;
      var key = request.query.key;
      var postCommit = request.body;

      log.info("CI: Attempting Build");
      ci.startBuild(ci_config, postCommit, job, key, function(res, err) {
        if (!err) {
          response.writeHead(200);
          response.end("CI: Attempting Build!\n" + res);
        } else {
          log.error("CI: Error starting build", err);
          response.writeHead(500);
          response.end("ERROR: " + err);
        }
      });
    });

    return router;
  };
})();
