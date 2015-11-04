'use strict';
module.exports = {

  _logger: null,
  _customInitializersAreResolved: false,

  routeNamespaces: [],
  adapterNamespaces: [],
  interfaceNamespaces: {},
  allModuleNamespaces: {},
  middlewareNamespaces: [],
  factoriesAndInheritance: {},

  init: function(app, config) {
    this._setProperties(app, config); 
    this._initializeComponentsConsistently(app.modules);
  }, 

  onCustomInitializersDone: function(app) {
    this._setCustomInitializersAsResolved();
    this._initializeComponentsConsistently(app);
  }, 

  _initializeComponentsConsistently: function(app) {
    if (!this._customInitializersAreResolved) {
      this._initializeLogger(app); 
      app.core.components.inheritance.index.init(app);  
      return app.core.components.initializers.customInitializers._runCustomInitializers(app);
    }
    app.core.components.inheritance.index.beginInheritance(app, this.factoriesAndInheritance);
    app.core.components.interfaces.index.init(this.factoriesAndInheritance, this.interfaceNamespaces);
    return this._initializeComponentsAsync(app);
  }, 

  // in case of heavy component, we can run it on new thread in race condition
  _initializeComponentsAsync: function(app) {
    var dirs = this._getComponentDirsAsArray(app);
    var length = dirs.length;
    for (var i = 0; i < length; i++) {
      this._initializeComponent(app, dirs[i]);
    }
  },

  _initializeComponent: function(app, component) {
    var components = app.core.components;
    if (typeof components[component].index !== 'object') {
      return this._logger.error(
        'Component "%s" need to have index file exporting object',
        component
      );
    }

    if (components[component].index.needInitializationByInitializer === false) {
      return;
    }   

    if (typeof components[component].index.init === 'function') {
      this._logger.debug('Initializing "component" %s', component);
      return components[component].index.init();        
    }
    this._logger.error(
      'Component "%s" doesn\'t have init method. ' 
      + 'If you dont\'t want to initialize it through the initializer, '
      + 'set this property with false as value "needInitializationByInitializer: false"',
      component  
    );
   },  

  _getComponentDirsAsArray: function(app) {
    var array = [];
    for (var x in app.core.components) {
      // these are already initialized
      if (x !== 'inheritance' && x !== 'initializers' && 
        x !== 'logger' && x !== 'interfaces') 
      {
        array.push(x);        
      }
    }
    return array;
  },   

  _setProperties: function(app, config) {
    this._setAllModuleNamespaces(app._factoriesAndInheritance);
    this._setFactoriesAndInheritanceNamespaces(app._factoriesAndInheritance);
    this._setInterfaceNamespaces(app._interfaceNamespaces);
    this._setAdapterNamespaces(app._adapterNamespaces);
    this._setMiddlewareNamespaces(app._middlewareNamespaces);
    this._setRouteNamespaces(app._routeNamespaces); 
    this._setConfigProperty(app, config);  
  }, 

  _setConfigProperty: function(app, config) {
    app.modules.config = config;
  }, 

  _setRouteNamespaces: function(namespaces) {
    this.routeNamespaces = namespaces;           
  },

  _setMiddlewareNamespaces: function(namespaces) {
    this.middlewareNamespaces = namespaces;       
  },

  _setAdapterNamespaces: function(namespaces) {    
    this.adapterNamespaces = namespaces;       
  },

  _setInterfaceNamespaces: function(namespaces) {
    this.interfaceNamespaces = namespaces;       
  },

  _setFactoriesAndInheritanceNamespaces: function(namespaces) {
    this.factoriesAndInheritance = namespaces;   
  },

  _setAllModuleNamespaces: function(namespaces) {
    this.allModuleNamespaces = namespaces;   
  },

  _setCustomInitializersAsResolved: function() {
    this._customInitializersAreResolved = true;
  }, 

  _setLogger: function(logger) {
    this._logger = logger;
  }, 

  _initializeLogger: function(app) {
    this._setLogger(app.core.components.logger.index.init(app));    
  },  


}; 