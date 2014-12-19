var path = require('path'),
    routes = require('./prestige/routes/index');

(function(){
  "use strict";
  function prestige(app) {
  this.app = app;
  app.use('/', routes);
}

module.exports = function(app, configFile) {
  return new prestige(app, configFile);
}

})();
