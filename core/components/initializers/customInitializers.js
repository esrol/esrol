'use strict';
module.exports = {
	
  _waitingInitializers: 0,

  _runCustomInitializers: function(app) {
  	this._setLoggerInstance(app);
  	var inheritanceAPI = app.core.components.inheritance.api;
    var x, initializer;
    this._logger.debug('Initializing "custom initializers"');
    for (x in app.initializers) {
      if (app.initializers[x] && typeof app.initializers[x].init === 'function') {        
        initializer = app.initializers[x].init(
          inheritanceAPI.getModule,
          inheritanceAPI.setValueToObjectFromApp
        );
        if (this._initializerIsPromise(app, x, initializer)) {
          this._waitAsyncInitializer(app, x, initializer);
        }       
      } else {
        this._logger.error('Initializer "%s" should have init method', x);
      }
    }
    this._onResolvedInitializer(app);
  },   

  _initializerIsPromise: function(app, name, initializer) {
    if (initializer && typeof initializer.then === 'function') {
      return true;
    }   
    return false;
  },  

  _waitAsyncInitializer: function(app, name, initializer) {
    var that = this;
    this._waitingInitializers++;
    initializer.then(function() {
      that._waitingInitializers--;
      that._onResolvedInitializer(app);
    });
  },

  _onResolvedInitializer: function(app) {     
    if (this._waitingInitializers === 0) {
      app.core.components.initializers.initializer.onCustomInitializersDone(app);
    }
  },  

  _setLoggerInstance: function(app) {
  	this._logger = app.core.components.logger.logger;
  }, 

}; 