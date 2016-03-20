var request = require('request'),
    splitca = require('split-ca'),
    fs = require('fs'),
    util = require('util');
/*
 *  This module is intended to provide capabilities for communicating with
 *  Jenkins from other web services. Initially, the intention is to get Gitlab
 *  working with Jenkins, and start a build on the job associated with
 *  that project I may enable building multiple jobs at some point, but for now
 *  I will hold off on that. It will accept SSL certificates as set in prestige.
 *  json under ci, and pass them in a request.js post  to jenkins
 */

(function(){
  "use strict";

  // Shared logger, configured when export method is called
  var log = {};

  exports.startBuild = function(config, data, job, key, callback) {
    if (config && job && key) {
      log = config.logger;
      log.debug("CI#startBuild", data);
      var buildPath = config.protocol + '://' +
                      config.host + '/buildByToken/build?job=' +
                      job + '&token=' + key;
      var options = {
        method: 'POST',
        uri: buildPath
      };

      if (config.sslEnabled === true) {
        /* istanbul ignore else  */
        log.debug("Making CI request over SSL");
        getSslOpts(config , function(opts){
          options.agentOptions = opts;
        });
      }

      parsePostCommit(data, function(bool){
        if (bool === true) {
          callback("Not Starting Build");
          /* istanbul ignore else  */
          log.debug("CI: Not starting build for", data);
        } else {
          log.debug("CI: Initializing Build!");
          initializeBuild(options, function(res, err){
            log.debug("CI: Options Hash:", options);
            if (err){
              callback(null, err);
              log.error("CI: Error initializing build",err);
            } else {
              callback(res);
              /* istanbul ignore else  */
              log.info("CI: response from Jenkins:", {res: res});
            }
          });
        }
      });
    } else if (config === undefined) {
      callback(null, "MISSING: config/prestige.json, refer to readme for help");
      log.info("MISSING: config/prestige.json, please refer to readme for help");
    } else {
      callback(null, "MISSING: config, job, user, or key");
      log.error("CI: MISSING: config, job, user, or key in: ", data);
    }
  };

  //handles certificates when SSL is enabled
  var getSslOpts = function(config, callback) {
    var rootCA = splitca(config.sslCaCert),
      clientKey = fs.readFileSync(config.sslClientKey),
      passphrase = config.passphrase,
      clientCert = fs.readFileSync(config.sslClientCert);

    var opts = {
      ca: rootCA,
      key: clientKey,
      passphrase: passphrase,
      cert: clientCert
    };

    callback(opts);
  };

  //returns true if #no_build exists
  var parsePostCommit = function(data, callback) {
    var res = false;
    for (var i = 0; i < data.total_commits_count; i++) {
      var noBuild = data.commits[i].message
                    .match(/(#(n|N)(o|O)(_|-)(b|B)(u|U)(i|I)(l|L)(d|D))/);
      if (noBuild !== null) { res = true; }
    }
    callback(res);
  };

  //calls requests object and returns callback based off response or error
  var initializeBuild = function(options, callback) {
    request(options, function(err, res, body) {
      if (err){
        log.error("CI: Error requesting from jenkins", err);
        callback(null, err);
      } else {
        log.debug("CI: Response", {res: res});
        if (res.statusCode === 201 || res.statusCode === 200) {
          callback("Starting Build");
          log.info("CI: Starting Build");
        //} else if (res.statusCode === 400) {
        //  initializeBuildParameterized(options, function(errr, ress) {
        //    try to handle the fallout when the user has a parameterized build
        //  })
        } else {
          callback(null, "Error Requesting Build!\n" +
          "RESPONSE: " + res + "\nBODY: " + body);
          log.error("CI: Error Requesting Build!",{res: res});
        }
      }
    });
  };

  var initializeBuildParameterized = function(options, callback) {
    // strip out options.uri
    // parse the key and job out via regex
    // reassign the uri with buildWithParameters path
    // retry request
    // return callback
  };

})();
