'use strict';
module.exports = {
  extends: ['core.middlewares', 'core.routers.mixins.socketHandles'],
  implements: ['core.routers.interfaces.socketRouter'],
  queue: [],  
  handle: null,
  init: function(app, middlewares) {
    this.debug('Initializing "tcp" router');
    this.getProtocoloMiddlewares(app, middlewares, 'tcp'); 
    this.handle = this.getHandle(app, 'tcp');
  },
  onConnection: function(socket) {
    this.debug('Running "onConnection" handle for tcp');
    this.runSocketBasedMiddlewares(socket, this.handle.method, this.handle.scope, this.queue);
  }, 
  runHandleInitMethod: function(app, server) { 
    this.debug('Running "handle" init method for tcp');   
    app.sockets.tcp.init(server);
  }, 
}; 