'use strict';
module.exports = {
  extends: ['core.servers.webSocket'],
  _runHTTPCluser: function(app, type, config) {
    var that = this;
    if (this._httpClusterRunned) {
      return;
    } 
    this._httpClusterRunned = true;
    this.includeModuleIfNotIncluded(app, 'sticky-session', 'sticky');
    app.vendors.sticky(this.serverInstances[type].instance).listen(config.port, function() {
      that._onHTTPListening(app, type, config);
    });   
  }, 
  _onHTTPListening: function(app, type, config) {
    this._onServerListening(type, config.port);
    if (type === 'http' && config.webSocket) {
      this._createWebSocket(app, type);
    }   
    if (type === 'https' && config.webSocket) {
      this._createWebSocket(app, type);
    }     
  },    
};
