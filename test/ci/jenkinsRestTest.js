var assert = require('assert'),
    chai = require('chai'),
    sinon = require('sinon'),
    nock = require('nock'),
    expect = chai.expect,
    should = chai.should(),
    ci = require('../../lib/prestige/ci.js');

(function(){
  "use strict";

  var fakePostCommit = {
    "before": "fcc2fd1d57a61d75b64d212ed56c040903b76612",
    "after": "9e9a631e3c97b7ed25409760aca15616cd57f9b3",
    "ref": "refs/heads/master",
    "user_id": 2,
    "user_name": "Eric Sabelhaus",
    "project_id": 9,
    "repository":
    { "name": "this is a test",
      "url": "Blah",
      "description": '',
      "homepage": "blah"
    },
    "commits": [{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d4",
      "message": "#BuIlD testing",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 1
  };

  var fakePostCommitNoBuild = {
    "before": "fcc2fd1d57a61d75b64d212ed56c040903b76612",
    "after": "9e9a631e3c97b7ed25409760aca15616cd57f9b3",
    "ref": "refs/heads/master",
    "user_id": 2,
    "user_name": "Eric Sabelhaus",
    "project_id": 9,
    "repository":
    { "name": "this is a test",
      "url": "Blah",
      "description": '',
      "homepage": "blah"
    },
    "commits": [{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d4",
      "message": "testing",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 1
  };

  //single fake commit, 0 commits
  var fakePostNoCommit = {
    "before": "fcc2fd1d57a61d75b64d212ed56c040903b76612",
    "after": "9e9a631e3c97b7ed25409760aca15616cd57f9b3",
    "ref": "refs/heads/master",
    "user_id": 2,
    "user_name": "Eric Sabelhaus",
    "project_id": 9,
    "repository":
    { "name": "this is a test",
      "url": "Blah",
      "description": '',
      "homepage": "blah"
    },
    "commits": [{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d4",
      "message": "#build testing",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 0
  };

  //mutli fake commit
  var fakePostMultiCommit = {
    "before": "fcc2fd1d57a61d75b64d212ed56c040903b76612",
    "after": "9e9a631e3c97b7ed25409760aca15616cd57f9b3",
    "ref": "refs/heads/master",
    "user_id": 2,
    "user_name": "Eric Sabelhaus",
    "project_id": 9,
    "repository":
    { "name": "this is a test",
      "url": "Blah",
      "description": '',
      "homepage": "blah"
    },
    "commits": [{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d4",
      "message": "#build this message does contain an issue number",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    },{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d5",
      "message": "#1 this message does contain an issue number",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    },{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d6",
      "message": "# this message does not contain an issue number",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 3
  };

  var redServPost = nock('http://jenkins.com/')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .post('/buildByToken/build?job=foobar&token=foobarbaz')
  .times(3)
  .reply(200, {
    "statusCode": 200
  });

  var redServPost2 = nock('https://jenkins.com/')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .post('/buildByToken/build?job=foobar&token=foobarbaz')
  .times(3)
  .reply(200, {
    "statusCode": 200
  });

  console.log('CI:TEST: Successful Build HTTPS');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "https",
    "port": 443,
    "sslEnabled": true,
    "sslCaCert": "test/server/my-root-ca.crt.pem",
    "sslClientCert": "test/server/my-server.crt.pem",
    "sslClientKey": "test/server/my-server.key.pem"
  },
  fakePostCommit,
  'foobar',
  'foobarbaz',
  function(res, err){
    should.exist(res);
    res.should.contain("Starting Build");
    should.not.exist(err);
  });

  console.log('CI:TEST: Successful Build HTTP');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommit,
  'foobar',
  'foobarbaz',
  function(res, err){
    should.exist(res);
    res.should.contain("Starting Build");
    should.not.exist(err);
  });

  console.log('CI:TEST: Successful Post Commit No Build HTTP');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommitNoBuild,
  'foobar',
  'foobarbaz',
  function(res, err){
    should.exist(res);
    res.should.contain("Not Starting Build");
    should.not.exist(err);
  });

  console.log('CI:TEST: Successful Post Commit Multiple Commit');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostMultiCommit,
  'foobar',
  'foobarbaz',
  function(res, err){
    should.exist(res);
    res.should.contain("Starting Build");
    should.not.exist(err);
  });

  console.log('CI:TEST: Failed Commit, Bad Project Identifier');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommit,
  'foo',
  'foobarbaz',
  function(res, err){
    should.exist(err);
    should.not.exist(res);
  });

  console.log('CI:TEST: Failed Commit, Bad Key');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommit,
  'foobar',
  'foo',
  function(res, err){
    should.exist(err);
    should.not.exist(res);
  });

  console.log('CI:TEST: Failed Setup, No Project Identifier');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommit,
  undefined,
  'foo',
  function(res, err){
    should.exist(err);
    should.not.exist(res);
  });

  console.log('CI:TEST: Failed Commit, Bad Key');

  ci.startBuild({
    "host": "jenkins.com",
    "protocol": "http",
    "port": 80,
    "sslEnabled": false
  },
  fakePostCommit,
  'foobar',
  'foo',
  function(res, err){
    should.exist(err);
    should.not.exist(res);
  });

})();
