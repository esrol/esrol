var fs = require('fs');
var path = require('path');
var application = require('./core/autoload.js');
var config;
try {
  config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', {encoding: 'utf8'}));
} catch(e) {
  console.log('Corrupted Config File');
  process.exit(1);
}
// get modules as one object
application = application.init(fs, path, __dirname, config.autoload);
// run initializers
application.app.core.initializers.init(application, config);
