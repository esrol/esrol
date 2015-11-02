'use strict';
module.exports = {
  extends: ['core.middlewares', 'core.routers.mixins.socketHandles'],
  implements: ['core.routers.interfaces.socketRouter'],
  queue: [],  
  handle: null,
  init: function(app, middlewares) {
    this.debug('Initializing "udp" router');
    this.getProtocoloMiddlewares(app, middlewares, 'udp'); 
    this.handle = this.getHandle(app, 'udp');
  },

  onConnection: function(socket) {
    this.debug('Running "onConnection" handle for udp');
    this.runSocketBasedMiddlewares(socket, this.handle.method, this.handle.scope, this.queue);
  },
   
  runHandleInitMethod: function(app, server) { 
    this.debug('Running "handle" init method for udp');   
    app.sockets.udp.init(server);
  }, 
}; 