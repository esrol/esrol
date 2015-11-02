'use strict';
module.exports = {
  _waitingInitializers: 0,
  _adapters: null,
  _factories: null,
  _routes: null,
  _middlewares: null,
  _interfaces: null,
  _allModuleNamespaces: null,

  init: function(app) {   
    this._preInitialization(app); 
  },

  _preInitialization: function(app) {
    this._setProperties(app);  
    app = app.app;
    this._setConfigObjectToApp(app, config);
    this._initializeLogger(app);
    this._inheritFromLogger(app);
    app.core.inheritance.init(app); 
    this._runCustomInitializers(app);       
  },

  _postInitialization: function(app) {
    this._buildInheritanceAndScope(app, this._factories);
    app.core.interfaces.init(this._factories, this._interfaces); 
    this._runDependencies(app);
    this._initializeServer(app);
  },   

  _runDependencies: function(app) {
    app.core.adapters.init(app, this._adapters);
    this._runRouters(app);
  }, 

  _runRouters: function(app) {
    app.core.routers.http.init(app, this._routes, this._middlewares);    
    app.core.routers.https.init(app, this._routes);    
    app.core.routers.webSocket.init(app, this._middlewares);    
    app.core.routers.tcp.init(app, this._routes, this._middlewares);    
    app.core.routers.udp.init(app, this._middlewares);         
  }, 

  _setConfigObjectToApp: function(app, config) {
    app.config = config;
  },

  _setProperties: function(app) {
    this._factories = app.factories;
    this._adapters = app.adapters;
    this._middlewares = app.middlewares;
    this._routes = app.routes;    
    this._interfaces = app.interfaces;      
    this._allModuleNamespaces = app.allModuleNamespaces;   
  }, 

  _initializeLogger: function(app) {
    app.core.logger.initLogger(app);    
  },

  _inheritFromLogger: function(app) {
    var logger = app.core.logger;
    var initializer = this;
    for (var x in logger) {
      if (!initializer.hasOwnProperty(x)) {
        this[x] = logger[x];
      }
    }
    this.debug('Begining "initialization"');
  }, 

  _initializeServer: function(app) {
    // run server
    app.core.servers.runServers.init(app);    
  },

  _runCustomInitializers: function(app) {
    var x, initializer;
    this.debug('Initializing "custom initializers"');
    for (x in app.initializers) {
      if (app.initializers[x] && typeof app.initializers[x].init === 'function') {        
        initializer = app.initializers[x].init(
          app.core.inheritance.publicGetterMethod,
          app.core.inheritance.publicSetterMethod
        );
        if (this._initializerIsPromise(app, x, initializer)) {
          this._waitAsyncInitializer(app, x, initializer);
        }       
      } else {
        this.error('Initializer "%s" should have init method', x);
      }
    }
    this._onResolvedInitializer(app);
  }, 

  _waitAsyncInitializer: function(app, name, initializer) {
    var that = this;
    this._waitingInitializers++;
      initializer.then(function() {
        that._waitingInitializers--;
        that._onResolvedInitializer(app);
      });
  },

  _initializerIsPromise: function(app, name, initializer) {
    if (initializer && typeof initializer.then === 'function') {
      return true;
    }   
    return false;
  },

  _onResolvedInitializer: function(app) {     
    if (this._waitingInitializers === 0) {
      this._postInitialization(app);
    }
  },

  _buildInheritanceAndScope: function(app, factories) { 
    this.debug('Initializing "inheritance"');   
    app.core.inheritance.onInitializationFinished(factories);
  }
};