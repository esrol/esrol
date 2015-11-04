'use strict';
module.exports = {
  extends: [
    'core.components.inheritance.api',
    'core.components.servers.mixins.server',
  ],
  _server: {},
  _sticky: {},
  _webSocket: {},
  _secureWebSocket: {},
  _clusterComponent: {},

  factory: function(use) {
    this._webSocket = use('core.components.servers.webSocket');
    this._clusterComponent = use('core.components.cluster.index');
    this._secureWebSocket = use('core.components.servers.secureWebSocket');
  }, 

  _runCluster: function() {
    var protocol = this._protocolType;
    var server = this._config.servers[protocol];
    var port = this._config.servers[this._protocolType].port;
    if (server.webSocket) {
      this._webSocket.createWebSocket(this._serverInstance);
      this._clusterComponent.pushServers(this._serverInstance, protocol, port);
    } 
    if (server.secureWebSocket) {
      this._secureWebSocket.createSecureWebSocket(this._serverInstance);
      this._clusterComponent.pushServers(this._serverInstance, protocol, port);
    }    
    this._bindServerListening(protocol, port);
    return this._listen();
  }, 

  _bindServerListening: function(protocol, port) {
    var that = this;
    this._serverInstance.on('listening', function() {
      that._onServerListening(protocol, port);
    });    
  }, 

  _onServerCreated: function() {
    this._runCluster();
  },     

  _listen: function(port) {
    if (this._shouldListen()) {
      var protocol = this._protocolType;
      var port = this._config.servers[this._protocolType].port;
      this._serverInstance.listen(port);               
    }
  }, 

  _shouldListen: function() {
    var config = this._config;
    var protocol = this._protocolType;
    var server = config.servers[protocol]
    var socket = server.secureWebSocket || server.webSocket;
    if (config.cluster.enabled === false) {
      return true;
    }
    if (!socket && !this._isMaster()) {
      return true;        
    } 
    return false;  
  },  

};