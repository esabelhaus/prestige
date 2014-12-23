var Routes = require('./prestige/routes/index');

(function(){
  "use strict";
  function Prestige(app, configFile) {
    this.app = app;
    var routes = new Routes(configFile);
    app.use('/', routes);
}

module.exports = function(app, configFile) {
  return new Prestige(app, configFile);
};

})();
