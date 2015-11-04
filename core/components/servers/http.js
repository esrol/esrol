'use strict';
module.exports = {
  extends: [
    'core.components.servers.mixins.reqResBased',
    'core.components.routers.http'    
  ],
  implements: [
    'core.components.servers.interfaces.server',
    'core.components.servers.interfaces.reqResBased'
  ],
  _packageName: 'http',

  _createServer: function() {    
    var that = this;
    this._serverInstance = this._server.createServer(function(req, res) {
      that.router(req, res);
    });
    this._onServerCreated();      
  }, 


};
