var fs = require('fs');
var path = require('path');
var application = require('./components/initializers/index.js');
var cofnig;
var appPath = path.join(__dirname, '..');
try {
  config = JSON.parse(fs.readFileSync(path.join(appPath + '/config/config.json'), {encoding: 'utf8'}));
} catch(e) {
  console.log('Corrupted Config File');
  process.exit(1);
}
application = application.init(fs, path, appPath, config);
