var bunyan = require('bunyan');

(function(){

  "use strict";

  module.exports = function(log_lvl){
    var log = bunyan.createLogger({
      name: 'Prestige',
      streams: [
        {
          level: "error",
          stream: process.stderr
        },
        {
          level: "info",
          stream: process.stdout
        },
        {
          level: "debug",
          stream: process.stdout
        }
      ],
      serializers: {
        req: reqSerializer,
        res: resSerializer
      }
    });

    function reqSerializer(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers
      };
    }

    function resSerializer(res) {
      return {
        headers: res.headersSent,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage
      };
    }

    return log;
  };
})();
