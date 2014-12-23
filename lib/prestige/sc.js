/*var nconf = require('nconf');

(function(){
  "use strict";

  module.exports = function(config, namespace, project, data, key, callback) {
    if (config && namespace && project && key) {
      var gitlab = require('gitlab')({
        url: config.gitlab.url,
        token: config.gitlab.token
      });
    } else if (config === undefined) {
      callback(null, "MISSING: config/prestige.json, please refer to readme for help");
    } else {
      callback(null, "MISSING: config, projectID, or key!");
    }
  };

})();
*/
