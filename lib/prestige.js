var Routes = require('./prestige/routes/index'),
    bunyan = require('bunyan'),
    nconf = require('nconf'),
    log_factory = require('./prestige/util/logger');

(function(){
  "use strict";

  function Prestige(app, configFile) {
    this.app = app;
    nconf.file({ file: configFile });
    var log_lvl = nconf.get("prestidigitation:log_lvl");
    var log = log_factory(log_lvl);
    var routes = new Routes(nconf, log);
    app.use('/', routes);
    app.use(function(req, res, next) {
      req.log = log.debug({req: req});
      next();
    });
  }

  module.exports = function(app, configFile) {
    return new Prestige(app, configFile);
  };

})();
