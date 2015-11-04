'use strict';
module.exports = {
  extends: [
    'core.components.servers.mixins.server',
    'core.components.inheritance.api',
  ],    

  _onServerCreated: function() {
    var protocol = this._protocolType;
    var port = this._config.servers[protocol].port;
    if (typeof this._serverInstance.listen === 'function') {
      this._serverInstance.listen(port);
    }
    if (typeof this._serverInstance.bind === 'function') {
      this._serverInstance.bind(port);
    }    
    this._onServerListening(protocol, port);
  }, 

  _serverShouldBeCreated: function() {
    if (this._config.cluster.enabled === false) {
      return true;
    }
    if (this._config.cluster.enabled === true && !this._cluster.isMaster) {
      return true;
    }
    return false;
  },   

}; 