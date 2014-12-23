# Prestige
A Server designed to connect distributed applications via their REST API

[![Build Status](https://travis-ci.org/e-sabelhaus/prestige.svg)](https://travis-ci.org/e-sabelhaus/prestige)
[![Code Climate](https://codeclimate.com/github/e-sabelhaus/prestige/badges/gpa.svg)](https://codeclimate.com/github/e-sabelhaus/prestige)

## The Gist... for now
Still working through how this will look. Currently, Gitlab talks to Redmine, updating issues based off commit messages in a post commit hook. Now Gitlab to talk to Jenkins, and starts a build on a particular job based off a post commit hook.

## About

### Gitlab to Redmine
Create a web hook on Gitlab which points to:

* `http://myhost/sc/tracking?project=PROJECT_IDENTIFIER&key=KEY`

* `project_identifier` is the url path to the project in redmine
* `key` is your personal account API key

This will accept a post commit hook from gitlab and update Redmine issues in the commit messages denoted by: `#12345678`

It will go through all of the commit messages in the push, looking for issue numbers, then update those issues with the commit message in a format like:
```
Commit: fcc2fd1d57a61d75b64d212ed56c040903b76612
Message: How well does this work #2376
Author: Eric Sabelhaus
```

### Gitlab to Jenkins
Create a web hook on Gitlab which points to:
 * `http://myhost/sc/ci?job=JOB&key=JOB_KEY`
 * `job` is the Jenkins job name from your CI server
 * `job_key` is used to access the project via https://wiki.jenkins-ci.org/display/JENKINS/Build+Token+Root+Plugin

 If you have the string `#build` in your commit message of that push, it will initiate a build on that project, rather then setting the CI server to poll your SCM constantly.

## Configuration
In the config directory, you will find
`config/prestige.json.example`.

Prestige performs all the specified communications based off this config. The nested objects withinin `prestidigitation`  tell prestige what it needs to know to talk to Jenkins and Redmine (for now, still need to implement Gitlab API in some way). The only required fields are the `host` and `protocol`. If you use SSL for Jenkins or Redmine, you must specify all of the ssl fields properly, and the user running Prestige must be able to access these files.

## The Prestige

### install
`npm install prestige`

### setup
```
var express = require('express'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Prestige = require('./lib/prestige');

(function(){
  "use strict";

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  var prestige = new Prestige(app, 'config/prestige.json');

  app.listen(3000);

})();
```

# Contributions

##Fork it, write your code, test early, test often.

### code of conduct
I use a combination of Mocha, Chai, and Nock to build out mock endpoints to validate my function calls are properly executed on the intended service to be leveraged. I also use istanbul to validate that 100% code coverage exists before merging a pull request.

### start the app
`grunt start`

# issues
https://github.com/e-sabelhaus/prestige/issues
