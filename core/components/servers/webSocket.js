'use strict';
module.exports = {
  extends: [ 'core.components.servers.mixins.webSocketBased'],
  _socketRouter: {},
  _socketIO: {},
  _socketInstance: {},

  factory: function(use) {
    this._socketRouter = use('core.components.routers.webSocket');
  }, 

  createWebSocket: function(server) {
    this._createSocket(server);
    this._onWebSocketListening('webSocket is running over HTTP');
  }, 

};
