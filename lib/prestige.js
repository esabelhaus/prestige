var routes = require('./prestige/routes/index');

(function(){
  "use strict";
  function Prestige(app) {
  this.app = app;
  app.use('/', routes);
}

module.exports = function(app, configFile) {
  return new Prestige(app, configFile);
};

})();
