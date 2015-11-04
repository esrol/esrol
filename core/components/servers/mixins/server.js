'use strict';
module.exports = {
  _serverInstance: {},
  
  factory: function(use) {
    this._cluster = use('vendors.cluster');
  }, 

  runServer: function() {
    var protocol = this._protocolType
    if (this._config.servers[protocol].enabled !== true) {
      return;
    }
    this._server = this.includeModuleIfNotIncluded(this._packageName, protocol);
    this._createServer();    
  },
    
  _onServerListening: function(type, port) {
    this.info('%s Server running on port %s', type.toUpperCase(), port);          
  },   

  _isMaster: function() {
    if (this._cluster.isMaster) {
      return true;
    }
    return false;
  }, 

};
