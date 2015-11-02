'use strict';
module.exports = {
  _createWebSocket: function(app, type) {
    this.debug('Initializing "webSocket" server');
    this.includeModuleIfNotIncluded(app, 'socket.io', 'socketIO');
    var io = app.vendors.socketIO(this.serverInstances[type].instance);
    this.serverInstances.webSocket.instance = io;
    app.core.routers.webSocket.runHandleInitMethod(app, io);
    io.on('connection', function(socket) {
      app.core.routers.webSocket.onConnection(socket);
    }); 
    this.info('webSocket is running over %s', type.toUpperCase());    
  },  
};