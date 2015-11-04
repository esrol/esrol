'use strict';
module.exports = {
  extends: [
    'core.components.logger.logger',
    'core.components.routers.mixins.reqResBased'
  ],
  implements: ['core.components.routers.interfaces.reqResBasedRouter'],
  _protocolType: 'http',
  _middlewares: {},
  _httpRoutes: {},
  _config: {},
  _routes: {},
  _queue: [],

  factory: function(use) {
    this._middlewares = use('core.components.middlewares.index');  
    this._httpRoutes = use('core.components.routes.index'); 
    this._config = use('config'); 
  },

  init: function() {
    if (this._config.servers.http.enabled !== true) {
      return;
    }
    this._getMiddlewares();
    this._getRoutes();
  }, 

}