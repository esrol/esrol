'use strict';
module.exports = {

  _http: {},
  _https: {},
  _webSocket: {},
  _secureWebSocket: {},
  _tcp: {},
  _udp: {},

  factory: function(use) {
    this._http = use('core.components.routers.http');
    this._https = use('core.components.routers.https');
    this._webSocket = use('core.components.routers.webSocket');
    this._secureWebSocket = use('core.components.routers.secureWebSocket');
    this._tcp = use('core.components.routers.tcp');
    this._udp = use('core.components.routers.udp');
  },

  init: function() {
    this._enableRoutes();
  },   
  _enableRoutes: function() {
    this._http.init();
    this._https.init();
    this._webSocket.init();
    this._secureWebSocket.init();
    this._tcp.init();
    this._udp.init();
  }, 
}; 