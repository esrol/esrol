'use strict';
var autoloader = require ('./autoload');
module.exports = {
  init: function(fsModule, pathModule, appPath, config) {
    this._setAppPathIntoConfigObject(appPath, config);
    this._initializeApplication(fsModule, pathModule, config);
  }, 
  _setAppPathIntoConfigObject: function(path, config) {
    config.paths.appPath = path;
  }, 
  _loadModules: function(fsModule, pathModule, appPath, config) {
    return autoloader.init(fsModule, pathModule, appPath, config.autoload);
  }, 
  _initializeApplication: function(fsModule, pathModule, config) {
    var app = this._loadModules(fsModule, pathModule, config.paths.appPath, config); 
    app.modules.core.components.initializers.initializer.init(app, config);
  }, 
}; 