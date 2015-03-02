var assert = require('assert'),
    chai = require('chai'),
    sinon = require('sinon'),
    nock = require('nock'),
    expect = chai.expect,
    should = chai.should(),
    tracking = require('../../lib/prestige/tracking');

(function(){
  "use strict";

  //single fake commit
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
      "message": "#1 testing",
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
      "message": "#1 testing",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 0
  };

  //single fake commit, no issue number
  var fakePostCommitNoIssue = {
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
      "message": "this message does not contain an issue number",
      "timestamp": "'2014-12-04T20:06:33+00:00'",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 1
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
      "message": "#2 this message does contain an issue number",
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

  //single fake commit
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
    "commits": [],
    "total_commits_count": 0
  };

  var redServGet = nock('http://redmine.com:80')
    .persist()
    .get('//issues/1.json?')
    .reply(200, {
      id: 1,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    })
    .get('//issues.json?')
    .reply(200, {
      id: 1,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    })
    .get('//projects/foo.json?')
    .times(3)
    .reply(200, {
      project:
      { "id": 1,
        "name": 'foo',
        "identifier": 'foo',
        "description": '',
        "status": 1,
        "created_on": '2014-01-13T16:16:20Z',
        "updated_on": '2014-05-01T20:15:01Z'
      }
    });

  var redServPut = nock('http://redmine.com:80')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .persist()
    .put('//issues/1.json', '*')
    .times(3)
    .reply(200, {
      "statusCode": 200
    });

  var twoRedServGet = nock('http://2redmine.com:80')
    .persist()
    .get('//issues.json?')
    .reply(200, {
      id: 1,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    }, {
      id: 2,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    })
    .get('//issues/1.json?')
    .reply(200, {
      id: 1,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    })
    .get('//issues/2.json?')
    .reply(200, {
      id: 2,
      project: { id: 2, name: 'foobar' },
      tracker: { id: 5, name: 'Task' },
      status: { id: 1, name: 'New' },
      priority: { id: 3, name: 'High' },
      author: { id: 3, name: 'Eric Sabelhaus' },
      assigned_to: { id: 3, name: 'Eric Sabelhaus' },
      parent: { id: 2 },
      subject: 'Create Automated Testing for prestige',
      description: 'Create Automated Testing for prestige',
      done_ratio: 0,
      spent_hours: 0,
      created_on: '2014-12-04T20:30:00Z',
      updated_on: '2014-12-05T17:48:16Z'
    })
    .get('//projects.json?')
    .times(3)
    .reply(200, {
      projects: [
      { "id": 1,
        "name": 'foo',
        "identifier": 'foo',
        "description": '',
        "status": 1,
        "created_on": '2014-01-13T16:16:20Z',
        "updated_on": '2014-05-01T20:15:01Z'
      },
      { "id": 2,
        "name": 'foobar',
        "identifier": 'foobar',
        "description": 'foobar',
        "status": 1,
        "created_on": '2014-11-21T20:18:53Z',
        "updated_on": '2014-11-21T20:18:53Z'
      }],
      total_count: 2,
      offset: 0,
      limit: 25
    });

  var twoRedServPut = nock('http://2redmine.com:80')
    .filteringRequestBody(function(path) {
      return '*';
    })
    .persist()
    .put('//issues/1.json', '*')
    .times(3)
    .reply(200, {
      "statusCode": 200
    })
    .put('//issues/2.json', '*')
    .times(3)
    .reply(200, {
      "statusCode": 200
    });

  describe('TRACKING:TEST Successful Single Update', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foobar',
      fakePostCommit,
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.contain("Started Issue Update");
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST No Commits', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foobar',
      fakePostNoCommit,
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.contain("Started Issue Update");
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST Successful Attempt, Project Name Not Matching', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "2redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foo',
      fakePostCommit,
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.contain("Started Issue Update");
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST Successful Multi-Update', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "2redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foobar',
      fakePostMultiCommit,
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.contain("Started Issue Update");
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST Successful Attempt, No Issue Number', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foobar',
      fakePostCommitNoIssue,
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.contain("Started Issue Update");
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST Bad Update, No Key', function() {
    it('returns a string', function(done){
      tracking.updateIssue({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'foobar',
      fakePostCommit,
      undefined,
      function(res, err) {
        should.exist(err);
        err.should.contain("MISSING: config, projectID, or key!");
        if (res) return done(res);
        done();
      });
    });
  });

  describe('TRACKING:TEST Bad Update, No Config', function() {
    it('returns a string', function(done){
    tracking.updateIssue(
      undefined,
      'foobar',
      fakePostCommit,
      'abcd1234',
      function(res, err) {
        should.exist(err);
        err.should.contain("MISSING: config/prestige.json, please refer to readme for help");
        if (res) return done(res);
        done();
      });
    });
  });

  describe('TRACKING:TEST good get issues request', function() {
    it('returns a json object', function(done){
      tracking.issues({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.be.an('object');
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST bad get issues request', function() {
    it('returns a string', function(done){
      tracking.issues({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      undefined,
      function(res, err) {
        should.exist(err);
        err.should.contain("MISSING: config or key!");
        if (res) return done(res);
        done();
      });
    });
  });

  describe('TRACKING:TEST good get projects request', function() {
    it('returns a json object', function(done){
      tracking.projects({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      'abcd1234',
      function(res, err) {
        should.exist(res);
        res.should.be.an('object');
        if (err) return done(err);
        done();
      });
    });
  });

  describe('TRACKING:TEST bad get projects request', function() {
    it('returns a string', function(done){
      tracking.projects({
        "host": "redmine.com",
        "apiKey": "abcd1234",
        "protocol": "http",
        "port": 80
      },
      undefined,
      function(res, err) {
        should.exist(err);
        err.should.contain("MISSING: config or key!");
        if (res) return done(res);
        done();
      });
    });
  });
})();
