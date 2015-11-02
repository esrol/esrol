'use strict';
module.exports = {
  extends: ['core.servers.server', 'core.routers.udp'],
  implements: ['core.servers.interfaces.server'],
  create: function(app) {
    var server;
    var port;
    var that = this;
    this.includeModuleIfNotIncluded(app, 'dgram', 'dgram');
    this.debug('Initializing "udp" server');
    var server = app.vendors.dgram.createSocket("udp4", function(message, info) {
      app.core.routers.udp.onConnection({
        message: message,
        info: info
      });
    });
    this.serverInstances.udp.instance = server;
    app.config.cluster ? port = 0 : port = app.config.servers.udp.port;
    app.core.routers.udp.runHandleInitMethod(app, server);
    server.bind(port, function() {
      that._onServerListening('UDP', server.address().port);
    });
  },      
};
