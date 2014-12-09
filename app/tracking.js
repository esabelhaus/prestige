var Redmine = require('promised-redmine');

(function(){
  "use strict";

  /*
   *  Expects nconf config JSON object, project identifier string, post commit hook data JSON object, redmine API key string.
   *  Initializes an update to issue(s) specified in commit messages.
   *  Issues must exist in the project specified by projectID,
   *  else they will not be updated.
   *
   */
  exports.updateIssue = function(config, projectID, data, key, callback) {
    if (config && projectID && key){
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getProjects()
      .success(function(projects){
        for (var project in projects.projects) {
          commitSize(redmineApi, data, projectID, projects, project);
        }
      })
      .then(callback("Started Issue Update"));
    } else {
      callback(null, "MISSING: config, projectID, or key!");
    }
  };

  //Handles whether the commit block as more than 1 new commit
  var commitSize = function(redmineApi, data, projectID, projects, project) {
    if (projects.projects[project].identifier === projectID) {
      var projectName = projects.projects[project].name;
      if (data.total_commits_count > 1) {
        multiUpdate(redmineApi, data, projectName);
      } else if (data.total_commits_count === 1) {
        singleUpdate(redmineApi, data, projectName);
      }
    }
  };

  //handles single commit push
  var singleUpdate = function(redmineApi, data, projectName) {
    var myID = data.commits[0].message.match(/(#\d{1,8})/);
    if (myID !== null) {
      doUpdate(redmineApi, myID[0].replace(/#/, ''), data, projectName, 0);
    } else {
      console.log("no issue ID");
    }
  };

  //handles multiple commit push
  var multiUpdate = function(redmineApi, data, projectName) {
    for (var i = 0; i < data.total_commits_count; i++) {
      var myID = data.commits[i].message.match(/(#\d{1,8})/);
      if (myID !== null) {
        doUpdate(redmineApi, myID[0].replace(/#/, ''), data, projectName, i);
      } else {
        console.log("no issue ID");
      }
    }
  };

  //completes the update
  var doUpdate = function(redmineApi, issueID, data, projectName, commit) {
    var message = {
      "notes": "Commit: " + data.commits[commit].id + "\nMessage: " + data.commits[commit].message + "\nAuthor: " + data.commits[commit].author.name
    };
    redmineApi.getIssue(issueID)
    .success(function(issue){
      //console.log(issueID);
      sameProject(issue, projectName, function(response) {
        if (response === true) {
          redmineApi.updateIssue(issueID, message)
          .success(function(response){
            console.log("Updated issue: " + issueID);
          });
        } else {
          console.log("issue is not in project: " + projectName);
        }
      });
    });
  };

  //validates whether the project contains the issue specified for update
  var sameProject = function(issue, projectName, callback) {
    if (issue.project.name === projectName) {
      callback(true);
    } else {
      callback(false);
    }
  };

  exports.issues = function(config, key, callback) {
    if (config && key) {
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getIssues()
      .success(function(issues){
        callback(issues, null);
      });
    } else {
      callback(null, "MISSING: config or key!");
    }
  };

  exports.projects = function(config, key, callback) {
    if (config && key){
      config.apiKey = key;
      var redmineApi = new Redmine(config);
      redmineApi.getProjects()
      .success(function(projects){
        callback(projects, null);
      });
    } else {
      callback(null, "MISSING: config or key!");
    }

  };

})();

/*
// create issue
var issue = {
project_id: 5,
subject: "This is test issue on " + Date.now(),
description: "Test issue description"
};
redmineApi.postIssue(issue)
.error(function(err) {
console.log("Error: " + err.message);
})
.success(function(data) {
console.log(data);
})
;
*/
