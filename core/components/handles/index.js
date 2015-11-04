'use strict';
module.exports = {
  _udp: {},
  _tcp: {},
  _webSocket: {},
  _secureWebSocket: {},
  factory: function(use) {
    this._udp = use('core.components.handles.udp');
    this._tcp = use('core.components.handles.tcp');
    this._webSocket = use('core.components.handles.webSocket');
    this._secureWebSocket = use('core.components.handles.secureWebSocket');
  }, 
  init: function() {
    this._runHandles();
  }, 
  _runHandles: function() {
    this._webSocket.init();
    this._secureWebSocket.init();
    this._tcp.init();
    this._udp.init();
  }, 
};
