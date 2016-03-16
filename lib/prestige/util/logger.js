var bunyan = require('bunyan');

(function(){

  "use strict";

  exports.err = function(err_comment, err) {
    var errSerializer = bunyan.stdSerializers.err;
    var log = bunyan.createLogger({
      name: 'Prestige',
      serializers: { 
        err: errSerializer 
      }
    });

    log.info(err_comment, {err: err});
  };

  exports.res = function(comment, res) {
    var log = bunyan.createLogger({name: 'Prestige'});
    if (!comment) {
      log.info({res: res});
    } else {
      log.info(comment, {res: res});
    }
  };

  exports.dbg = function(comment, data) {
    var errSerializer = bunyan.stdSerializers.err;
    var log = bunyan.createLogger({
      name: 'Prestige',
      serializers: { 
        err: errSerializer 
      },
      streams: [
        {
          stream: process.stdout,
          level: "debug"
        }
      ]
    });

    if (!data) {
      log.debug(comment);
    } else {
      log.debug(comment, {err: data});
    }
  };

  exports.info = function(info) {
    var log = bunyan.createLogger({name: 'Prestige'});
    log.info(info);
  };

})();
