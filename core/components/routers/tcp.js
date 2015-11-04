'use strict';
module.exports = {
  extends: [
    'core.components.logger.logger',
    'core.components.routers.mixins.socketHandle'
  ],
  implements: ['core.components.routers.interfaces.socketHandle'],
  _protocolType: 'tcp',
  _middlewares: {},
  _handles: {},
  _config: {},
  _handle: {},
  _queue: [],

  factory: function(use) {
    this._middlewares = use('core.components.middlewares.index');  
    this._handles = use('core.components.handles.tcp');  
    this._config = use('config'); 
  },

  init: function() {
    var config = this._config.servers;
    if (config.tcp.enabled !== true) {
      return;
    }
    this._setMiddlewares();
    this._setHandle();
  }, 
}; 