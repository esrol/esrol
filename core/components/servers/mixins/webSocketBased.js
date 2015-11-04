'use strict';
module.exports = {
  extends: [
    'core.components.logger.logger', 
    'core.components.servers.mixins.server', 
    'core.components.inheritance.api'
  ],

  _config: {},

  factory: function(use) {
    this._config = use('config');
  }, 

  _createSocket: function(server) {
    var router = this._socketRouter;
    this.debug('Initializing "webSocket" server');
    this._socketIO = this.includeModuleIfNotIncluded('socket.io', 'socketIO');
    this._socketInstance = this._socketIO(server);
    this._socketInstance.on('connection', function(socket) {
      router.router(socket)
    });      
  },  

  _onWebSocketListening: function(message) {
    if (this._config.cluster.enabled === false) {
      return this.info(message);            
    }
    if (!this._isMaster()) {
      this.info(message);      
    }     
  },  
};
