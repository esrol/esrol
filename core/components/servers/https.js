'use strict';
module.exports = {
  extends: [
    'core.components.servers.mixins.reqResBased',
    'core.components.routers.https'
  ],
  implements: [
    'core.components.servers.interfaces.server',
    'core.components.servers.interfaces.reqResBased'
  ],
  _packageName: 'https', 

  factory: function(use) {
    this._path = use('vendors.path');
  }, 

  _createServer: function() {
    var that = this;
    var options = this._getOptions();
    this._serverInstance = this._server.createServer(options, function(req, res) {
      that.router(req, res);
    });
    this._onServerCreated();
  }, 
  
  _getOptions: function() {
    var key = this._path.join(this._config.paths.appPath, 'config', 'cert', 'key.pem');
    var cert = this._path.join(this._config.paths.appPath, 'config', 'cert', 'cert.pem');
    return {
      key: this._fs.readFileSync(key),      
      cert: this._fs.readFileSync(cert),
      host: config.host,
      port: config.port,
      path: config.path,
      rejectUnauthorized: config.rejectUnauthorized,
      requestCert: config.requestCert,
      agent: config.agent         
    };
  }, 


};
