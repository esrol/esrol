'use strict';
module.exports = {
  extends: [
    'core.components.servers.mixins.socketBased',    
    'core.components.routers.udp'    
  ],
  implements: [
    'core.components.servers.interfaces.server',
    'core.components.servers.interfaces.socketBased'
  ],
  _packageName: 'dgram',
  _createServer: function() {
    var that = this;
    var type = this._config.servers.udp.type;
    if (this._serverShouldBeCreated()) {
      this._serverInstance = this._server.createSocket(type, function(message, info) {
        that.router({
          message: message, 
          info: info
        });
      });
      this._onServerCreated();      
    }      
  },   
}; 