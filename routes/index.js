var express = require('express')
  ,  router = express.Router()
  ,  https = require('https')
  ,  tracking = require('../app/tracking')
  ,  sc = require('../app/sc')
  ,  ci = require('../app/ci')
;

//handle requests from source control
router.post('/sc/:project/:key', function(req, res) {
  var project = req.params.project;
  var key = req.params.key;
  var postCommit = req.body;

  tracking.updateIssue(project, postCommit, key);

  res.writeHead(200);
  res.end("Got it!")

});

//handle requests from issue tracking
router.post('tracking/:project/:key', function(req, res) {

});

//handle request from continuous integration
router.post('/ci/:project/:key', function(req,res) {

});

module.exports = router;
