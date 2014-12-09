var nconf = require('nconf');

(function(){
  "use strict";

  nconf.file({ file: 'config/prestige.json' });

  //jenkins api
  var jenkinsapi = require('jenkins-api');
  var jenkins = jenkinsapi.init("http://username:password@jenkins.yoursite.com");

})();
