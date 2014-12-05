var nconf = require('nconf');

nconf.file({ file: 'config/prestige.json' });

//gitlab api
var gitlab = require('gitlab')({
  url: nconf.get('prestidigitation:gitlab:url'),
  token: nconf.get('prestidigitation:gitlab:token')
});
