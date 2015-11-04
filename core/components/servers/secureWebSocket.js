'use strict';
module.exports = {
  extends: [ 'core.components.servers.mixins.webSocketBased'],
  _socketRouter: {},
  _socketIO: {},
  _socketInstance: {},

  factory: function(use) {
    this._socketRouter = use('core.components.routers.secureWebSocket');
  }, 

  createSecureWebSocket: function(server) {
    this._createSocket(server);
    this._onWebSocketListening('secureWebSocket is running over HTTPS');
  }, 
};
