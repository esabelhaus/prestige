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
      "message": "testing",
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
      "message": "testing #nO-BuIlD",
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
      "message": "this message does contain an issue number",
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

  var ciServPost = nock('http://jenkins.com/')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .post('/buildByToken/build?job=foobar&token=foobarbaz')
  .reply(201, {
    "statusCode": 201
  })
  .post('/buildByToken/build?job=foobar&token=foo')
  .reply(404);

  var ciServPost2 = nock('https://jenkins.com/')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .post('/buildByToken/build?job=foobar&token=foobarbaz')
  .reply(201, {
    "statusCode": 201
  });

  describe('CI:TEST Successful Build HTTPS', function() {
    it('returns a string', function(done){
      ci.startBuild({
        "log_lvl": "debug",
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
        if(err){
          done(err);
        }
        done();
      });
    });
  });

  describe('CI:TEST Successful Build HTTP', function() {
    it('returns a string', function(done){
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
        if(err){
          done(err);
        }
        done();
      });
    });
  });

  describe('CI:TEST Successful Post Commit No Build HTTP', function() {
    it('returns a string', function(done){
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
        if(err){
          done(err);
        }
        done();
      });
    });
  });

  describe('CI:TEST Successful Post Commit Multiple Commit', function() {
    it('returns a string', function(done){
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
        if(err){
          done(err);
        }
        done();
      });
    });
  });

  describe('CI:TEST Failed Commit, Bad Project Identifier', function() {
    it('returns a string', function(done){
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
        err.should.be.an('object');
        if(res){
          done(res);
        }
        done();
      });
    });
  });

  describe('CI:TEST Failed Commit, No Config', function() {
    it('returns a string', function(done){
      ci.startBuild(
      undefined,
      fakePostCommit,
      'foobar',
      'foo',
      function(res, err){
        should.exist(err);
        err.should.contain('MISSING: config/prestige.json, refer to readme for help');
        if(res){
          done(res);
        }
        done();
      });
    });
  });

  describe('CI:TEST Failed Commit, Bad Key', function() {
    it('returns a string', function(done){
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
        err.should.contain('Error Requesting Build!');
        if(res){
          done(res);
        }
        done();
      });
    });
  });

  describe('CI:TEST Failed Setup, No Project Identifier', function() {
    it('returns an object', function(done){
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
        err.should.contain('MISSING: config, job, user, or key');
        if(res){
          done(res);
        }
        done();
      });
    });
  });

  describe('CI:TEST Failed Commit, Bad Key', function() {
    it('returns a string', function(done){
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
        err.should.contain('Error Requesting Build!');
        if(res){
          done(res);
        }
        done();
      });
    });
  });
})();
