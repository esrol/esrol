'use strict';
module.exports = {
  extends: ['core.middlewares', 'core.routers.mixins.httpMethods'],
  _routes: {},
  _supportedMethods: [],
  queue: [],
  middlewares: null,
  init: function(app, routes, middlewares) {
    this._supportedMethods = app.config.servers.https.methods;
    if (!app.config.servers.https.enabled) {
      return;
    } 
    this.debug('Initializing "https" router');
    if (!this._supportedMethods || !this._supportedMethods.length) {
      app.helpers.log.critical('Xena needs at least one https method eg: GET');
      process.exit(1);
    }
    this.getProtocoloMiddlewares(app, middlewares, 'https'); 
    this.getRoutes(app, routes);   
  },  
}