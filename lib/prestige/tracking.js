var Redmine = require('../../src/node-promised-redmine/redmine'),
    util = require('util');

(function(){
  "use strict";

  /*
   *  Expects nconf config JSON object, project identifier string, post commit hook data JSON object, redmine API key string.
   *  Initializes an update to issue(s) specified in commit messages.
   *  Issues must exist in the project specified by projectID,
   *  else they will not be updated.
   *
   */

  // Shared logger, configured when export method is called
  var log;

  exports.updateIssue = function(config, projectID, data, key, callback) {
    if (config && projectID && key){
      log = config.logger;
      log.debug("Tracking#updateIssue", data);
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getProject(projectID)
        .success(function(projectResponse){
          var projectName = projectResponse.project.name;
          for (var i = 0; i < data.total_commits_count; i++) {
            var issueNumber = data.commits[i].message.match(/(#\d{1,8})/);
            if (issueNumber !== null) {
              doUpdate(redmineApi, issueNumber[0].replace(/#/, ''), projectResponse.project.name, data.commits[i]);
            } else {
              log.info("Tracking: Commit #"+commit.id.substring(0,10)+" has no issue ID in the message.  Nothing to do.");
            }
          }
        })
        .then(callback("Started Issue Update"));
    } else if (config === undefined) {
      callback(null, "MISSING: config/prestige.json, please refer to readme for help");
      log.error("Tracking: MISSING: config/prestige.json, please refer to readme for help");
    } else {
      callback(null, "MISSING: config, projectID, or key!");
      log.error("Tracking: MISSING: config, projectID, or key!", data);
    }
  };

  //completes the update
  var doUpdate = function(redmineApi, issueID, projectName, commit) {
    log.debug("Tracking#doUpdate", {redmineApi: redmineApi, issueID: issueID, projectName: projectName, commit: commit});
    var message = {
      "notes": "Commit: \""+ commit.id.substring(0,10) + "\":"+ commit.url +
             "\nMessage: " + commit.message +
             "\nAuthor: " + commit.author.name
    };
    redmineApi.getIssue(issueID)
    .success(function(issue){
      if(issue.project.name === projectName) {
        redmineApi.updateIssue(issueID, message)
        .success(function(response){
          log.info("Tracking: Updated issue: " + issueID);
        });
      } else {
        log.info("Tracking: issue: " + issueID + " is not in project: " + projectName);
      }
    });
  };

  exports.issues = function(config, key, callback) {
    log = config.logger;
    if (config && key) {
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getIssues()
      .success(function(issues){
        callback(issues, null);
        log.debug("Tracking: Issues Returned from Redmine: ", issues);
      });
    } else {
      callback(null, "MISSING: config or key!");
      log.info("Tracking: MISSING: config: "+ util.inspect(config) + " or key: "+ key +"!");
    }
  };

  exports.projects = function(config, key, callback) {
    log = config.logger;
    if (config && key){
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getProjects()
      .success(function(projects){
        callback(projects, null);
        log.debug("Tracking: Projects returned from Redmine: ", projects);
      });
    } else {
      callback(null, "MISSING: config or key!");
      log.info("Tracking: MISSING: config: " + util.inspect(config) + " or key: "+ key);
    }

  };

})();
