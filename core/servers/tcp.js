'use strict';
module.exports = {
  extends: ['core.servers.server', 'core.routers.tcp'],
  implements: ['core.servers.interfaces.server'],
  create: function(app) {
    var server;
    var port;
    var that = this;
    this.includeModuleIfNotIncluded(app, 'net', 'net');
    this.debug('Initializing "tcp" server');
    server = app.vendors.net.createServer(function(socket) {
      app.core.routers.tcp.onConnection(socket);
    });
    this.serverInstances.tcp.instance = server;
    app.config.cluster ? port = 0 : port = app.config.servers.tcp.port;
    app.core.routers.tcp.runHandleInitMethod(app, server);
    server.listen(port, function() {
      that._onServerListening('TCP', server.address().port);
    });
  },  
};
