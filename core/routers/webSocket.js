'use strict';
module.exports = {
  extends: ['core.middlewares', 'core.routers.mixins.socketHandles'],
  implements: ['core.routers.interfaces.socketRouter'],
  queue: [],  
  handle: null,
  init: function(app, middlewares) {
    this.debug('Initializing "webSocket" router');
    this.getProtocoloMiddlewares(app, middlewares, 'webSocket'); 
    this.handle = this.getHandle(app, 'webSocket');
  },
  onConnection: function(socket) {
    this.debug('Running "onConnection" handle for webSocket');
    this.runSocketBasedMiddlewares(socket, this.handle.method, this.handle.scope, this.queue);
  }, 
  runHandleInitMethod: function(app, server) { 
    this.debug('Running "handle" init method for webSocket');   
    app.sockets.webSocket.init(server);
  }, 
}; 