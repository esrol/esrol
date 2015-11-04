'use strict';
module.exports = {
  _http: {},
  _https: {},
  _tcp: {},
  _udp: {},
  _cluster: {},
  factory: function(use) {
    this._http = use('core.components.servers.http');
    this._https = use('core.components.servers.https');
    this._tcp = use('core.components.servers.tcp');
    this._udp = use('core.components.servers.udp');
    this._cluster = use('core.components.cluster.index');
  }, 
	init: function() {
		this._runServers();
    this._cluster.enableCluster();
	}, 
  _runServers: function() {
    this._http.runServer();
    this._https.runServer();
    this._tcp.runServer();
    this._udp.runServer();
  }, 
};
