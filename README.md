# Prestige
A Server module designed to connect distributed applications via their REST API

[![Build Status](https://travis-ci.org/esabelhaus/prestige.svg)](https://travis-ci.org/e-sabelhaus/prestige)
[![Code Climate](https://codeclimate.com/github/esabelhaus/prestige/badges/gpa.svg)](https://codeclimate.com/github/esabelhaus/prestige)

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

Prestige performs all the specified communications based off this config. The nested objects withinin `prestidigitation`  tell prestige what it needs to know to talk to Jenkins and Redmine (for now, still need to implement Gitlab API in some way). The only required fields are the `host` and `protocol`. If you use SSL for Jenkins or Redmine, you must specify all of the ssl fields properly, and the user running Prestige must be able to access the client key/cert and CA files.

## The Prestige

### install
`npm install --save prestige`

### setup
``` javascript
var express = require('express'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Prestige = require('prestige');

(function(){
  "use strict";

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  var prestige = new Prestige(app, 'config/prestige.json');

  app.listen(3001);

})();
```

### Configuring SSL
I prefer to use nginx proxying for ssl, it really doesn't add much overhead and its quite simple.
I use the following for a server config in /etc/nginx/conf.d/prestige.conf
```
server {
    listen 1337 ssl;
    server_name [my host];

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.key;

    ssl_client_certificate /path/to/ca.pem;
    ssl_verify_client on;
    ssl_verify_depth 3;

    ssl_prefer_server_ciphers On;
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;

    ssl_session_timeout 5m;

    location / {
        try_files $uri @prestige;
    }

    location @prestige {
        # If you use https make sure you disable gzip compression
        # to be safe against BREACH attack
        gzip off;

        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_redirect off;

        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header SSL_CLIENT_VERIFY $ssl_client_verify;

        proxy_pass http://localhost:3001;
    }
}
```

The second part of this would be to disable external access to port 3001 via Iptables

Once this is in place, you will be able to perform SSL authentication to prestige over whatever port you set in place of `listen 1337 ssl`


# Contributions

##Fork it, write your code, test early, test often.

### code of conduct
I use a combination of Mocha, Chai, and Nock to build out mock endpoints to validate my function calls are properly executed on the intended service to be leveraged. I also use istanbul to validate that 100% code coverage exists before merging a pull request.

### Testing

#### test suite
```
npm install
npm install -g grunt grunt-cli mocha
grunt
```

This will run the mocha test suite and jshint to validate no linting errors.
Be aware, I am pretty strict on cyclomatic complexity, it will blow up
if you have a level higher than 4 in your functions.

#### test coverage
```
npm install -g istanbul
istanbul cover _mocha test/path/to/test.js
```

The test files map to their respective file in the lib/prestige directory,
just replace path/to/test.js with the correct path to the test file

Coverage can be done in two ways.
1. Test a single function
 * This will test for 100% coverage on that function in lib/prestige/
2. Test the full app functionality
 * This will test the "golden path" to verify prestige as a whole functions correctly

### start the app
`grunt start`

# issues
https://github.com/e-sabelhaus/prestige/issues
