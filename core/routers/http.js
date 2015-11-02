'use strict';
module.exports = {
  extends: ['core.middlewares', 'core.routers.mixins.httpMethods'],
  _routes: {},
  _supportedMethods: [],
  queue: [],
  middlewares: null,
  // supported methods from config file
  init: function(app, routes, middlewares) {
    this._supportedMethods = app.config.servers.http.methods;
    if (!app.config.servers.http.enabled) {
      return;
    } 
    this.debug('Initializing "http" router');
    if (!this._supportedMethods || !this._supportedMethods.length) {
      app.helpers.log.critical('Xena needs at least one http method eg: GET');
      process.exit(1);
    }
    this.getProtocoloMiddlewares(app, middlewares, 'http'); 
    this.getRoutes(app, routes); 
  },  
}