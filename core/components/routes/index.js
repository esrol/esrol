'use strict';
module.exports = {
  needInitializationByInitializer: false,
  factory: function(use) {
    this._routes = use('core.components.routes.routes');
  }, 
  init: function(protocolType) {
    this._routes.init(protocolType);
    return this._routes.getRoutes();
  }, 
};
