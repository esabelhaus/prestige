var Redmine = require('promised-redmine');
var nconf = require('nconf');

//grab our prestige configuraton
nconf.file({ file: 'config/prestige.json' });

var config = nconf.get('prestidigitation:tracking');

exports.updateIssue = function(projectID, data, key) {
  config.apiKey = key;

  var redmineApi = new Redmine(config);

  redmineApi.getProjects()
  .success(function(projects){ // success is an alias of then whithout the promise rejection management in D.js the underlying promise library
    for (var project in projects.projects) {
      console.log("1")
      if (projects.projects[project].identifier === projectID) {
        var projectName = projects.projects[project].name;
        console.log("2")
        if (data.total_commits_count >= 3) {
          multiUpdate(redmineApi, data, projectName)
        } else if (data.total_commits_count < 3 && data.total_commits_count > 0) {
          singleUpdate(redmineApi, data, projectName)
        }
      }
    }
  })
};

var singleUpdate = function(redmineApi, data, projectName) {
  console.log("6");
  var issueID = data.commits[0].message.match(/(#\d{1,8})/g)[0].replace(/#/, '')
  if (issueID !== null) {
    doUpdate(redmineApi, data, projectName)
  }
};

var multiUpdate = function(redmineApi, data, projectName) {
  console.log("3")
  for (var i = 0; i < data.total_commits_count -1; i++) {
    console.log("4")
    var issueID = data.commits[i].message.match(/(#\d{1,8})/g)[0].replace(/#/, '')
    if (issueID !== null) {
      doUpdate(redmineApi, issueID, data, projectName)
    }
  }
};

var doUpdate = function(redmineApi, issueID, data, projectName) {
  var message = {
    "notes": "Commit: " + data.commits[0].id + "\nMessage: " + data.commits[0].message + "\nAuthor: " + data.commits[0].author.name
  }
  console.log("7")
  redmineApi.getIssue(issueID)
  .success(function(issue){
    console.log("8")
    sameProject(issue, projectName, function(response) {
      console.log("9")
      if (response === true) {
        redmineApi.updateIssue(issueID, message)
        .success(function(response){
          console.log("Updated issue: " + issueID + "\nresponse was: " + response)
        })
      } else {
        console.log("issue is not in project: " + projectName)
      }
    })
  })
  .error(function(error){
    console.log(error)
  })
};

var sameProject = function(issue, projectName, callback) {
  if (issue.project.name === projectName) {
    callback(true)
  } else {
    callback(false)
  }
};

exports.issues = function(key) {
  config.apiKey = key;

  var redmineApi = new Redmine(config);

  redmineApi.getIssues()
  .success(function(issues){ // success is an alias of then whithout the promise rejection management in D.js the underlying promise library
    console.log(issues);
  })
};

exports.projects = function(key) {
  config.apiKey = key;

  var redmineApi = new Redmine(config);

  redmineApi.getProjects()
  .success(function(projects){ // success is an alias of then whithout the promise rejection management in D.js the underlying promise library
    console.log(projects);
  })

};


/*
redmineApi.getIssues()
.success(function(issues){ // success is an alias of then whithout the promise rejection management in D.js the underlying promise library
console.log(issues);
})

redmineApi.getProjects()
.success(function(projects){ // success is an alias of then whithout the promise rejection management in D.js the underlying promise library
console.log(projects);
})


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


// update issue
var issueId = 2606; // exist id
var issueUpdate = {
notes: "this is comment"
};
redmineApi.updateIssue(issueId, issueUpdate)
.success(function(data) {
console.log(data);
})
.rethrow(function(err) {
console.log("Error: " + err.message);
})
;
*/
