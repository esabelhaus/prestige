var express = require('express'),
    app = express(),
    logger = require('morgan'),
    Prestige = require('../../lib/prestige'),
    assert = require('assert'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    nock = require('nock'),
    request = require('supertest');

(function(){
  "use strict";
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  var prestige = new Prestige(app, 'test/config/prestige.json');

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
      "message": "testing ci #BuIlD testing tracking #1234",
      "timestamp": "2014-12-04T20:06:33+00:00",
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
      "message": "#build this message does contain a build statement",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    },{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d5",
      "message": "#1234 this message does contain an issue number",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    },{
      "id": "88edeab4b2cd748dbc0e7e7b9e74d2a72a8655d6",
      "message": "# this message does not contain an issue number or build",
      "timestamp": "2014-12-04T20:06:33+00:00",
      "url": "Blah",
      "author": {
        "name": "argh"
      }
    }],
    "total_commits_count": 3
  };

  var ciServPost = nock('https://jenkins.com/')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .post('/buildByToken/build?job=foobar&token=foobarbaz')
  .reply(201, {
    "statusCode": 201
  });



  var redServPut = nock('https://redmine.com')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .persist()
  .put('//issues/1234.json', '*')
  .reply(200, {
    "statusCode": 200
  })
  .get('//issues/1234.json?')
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

describe('POST /sc/ci', function(){
  it('respond with json and return 200', function(done){
    request(app)
    .post('/sc/ci?job=foobar&key=foobarbaz')
    .send(fakePostCommit)
    .expect(200)
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });
});

describe('POST /sc/ci MultiCommit', function(){
  it('respond with json and return 200', function(done){
    request(app)
    .post('/sc/ci?job=foobar&key=foobarbaz')
    .send(fakePostMultiCommit)
    .expect(200)
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });
});

describe('POST /sc/tracking', function(){
  it('respond with json and return 200', function(done){
    request(app)
    .post('/sc/tracking?project=foobar&key=foobarbaz')
    .send(fakePostCommit)
    .expect(200)
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });
});

describe('POST /sc/tracking MultiCommit', function(){
  it('respond with json and return 200', function(done){
    request(app)
    .post('/sc/tracking?project=foobar&key=foobarbaz')
    .send(fakePostMultiCommit)
    .expect(200)
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });
});

})();
