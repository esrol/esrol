'use strict';
module.exports = {
  needInitializationByInitializer: false,  
  _config: {},
  _cluster: {},
  _servers: {},

  factory: function(use) {
    this._config = use('config');
    this._cluster = use('core.components.cluster.cluster');
  }, 
  
  enableCluster: function() {  
    this._cluster.init(this._servers, this._config);      
  }, 

  pushServers: function(server, protocol, port) {
    this._servers[port] = {
      server: server,
      protocol: protocol,
      port: port
    };
  }, 

}; 