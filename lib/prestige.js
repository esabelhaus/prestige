var Routes = require('./prestige/routes/index'),
    bunyan = require('bunyan');

(function(){
  "use strict";
  function Prestige(app, configFile) {
    this.app = app;
    var routes = new Routes(configFile);
    app.use('/', routes);
    app.use(function(req, res, next) {
      req.log = log.child({req: req});
      next();
    });
  }

  var log = bunyan.createLogger({
    name: 'myapp',
    serializers: {
      req: reqSerializer
    }
  });

  function reqSerializer(req) {
    return {
      method: req.method,
      url: req.url,
      headers: req.headers
    };
  }

  module.exports = function(app, configFile) {
    return new Prestige(app, configFile);
  };

})();
