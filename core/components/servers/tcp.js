'use strict';
module.exports = {
  extends: [
    'core.components.servers.mixins.socketBased',    
    'core.components.routers.tcp'    
  ],
  implements: [
    'core.components.servers.interfaces.server',
    'core.components.servers.interfaces.socketBased'
  ],
  _packageName: 'net',
  _createServer: function() {
    var that = this;
    if (this._serverShouldBeCreated()) {
      this._serverInstance = this._server.createServer(function(socket) {
        that.router(socket);
      });
      this._onServerCreated();
    }    
  },   
}; 