var request = require('request'),
    splitca = require('split-ca'),
    fs = require('fs');

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

  exports.startBuild = function(config, data, job, key, callback) {
    if (config && job && key) {
      var buildPath = config.protocol + '://' +
                      config.host + '/buildByToken/build?job=' +
                      job + '&token=' + key;
      var options = {
        method: 'POST',
        uri: buildPath
      };

      if (config.sslEnabled === true) {
        getSslOpts(config , function(opts){
          options.agentOptions = opts;
        });
      }

      parsePostCommit(data, function(bool){
        if (bool === true) {
          callback("Not Starting Build");
        } else {
          initializeBuild(options, function(res, err){
            if (err){
              callback(null, err);
            } else {
              callback(res);
            }
          });
        }
      });
    } else if (config === undefined) {
      callback(null, "MISSING: config/prestige.json, refer to readme for help");
    } else {
      callback(null, "MISSING: config, job, user, or key");
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
        console.log(err);
        callback(null, err);
      } else {
        if (res.statusCode === 201 || res.statusCode === 200) {
          callback("Starting Build");
        } else {
          callback(null, "Error Requesting Build!\n" +
          "RESPONSE: " + res + "\nBODY: " + body);
        }
      }
    });
  };

})();
