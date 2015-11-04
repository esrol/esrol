'use strict';
module.exports = {

  extends: [
    'core.components.logger.logger', 
    'core.components.inheritance.api',
    'core.components.utilities.mixins'
  ],
  _config: {},
  _routes: {},
  _routesNamespaces: [],
  _supportedMethods: [],

  factory: function(use) {
    this._config = use('config');
    this._routesNamespaces = use('core.components.initializers.initializer.routeNamespaces');
  },

  init: function(protocolType) {
    protocolType = protocolType.toLowerCase();
    this._resetRoutes();
    this._setSupportedMethods(protocolType);
    this._findRoutes(protocolType, this._routesNamespaces);
  }, 

  getRoutes: function() {
    return this._routes;
  },

  _resetRoutes: function() {
    this._routes = {};
  }, 

  _setSupportedMethods: function(protocolType) {
    this._supportedMethods = this._getSupportedMethods(protocolType);
  }, 

  _getSupportedMethods: function(protocolType) {    
    var supportedMethods = this._config.servers[protocolType].methods;
    if (protocolType !== 'http' && protocolType !== 'https') {
      return false;
    }
    if (!supportedMethods || !supportedMethods.length) {
      this._logger.error(
        '%s protocol needs at least one method eg: GET',
        protocolType.toUpperCase()
      );
    }
    return supportedMethods;
  }, 

  _findRoutes: function(protocolType, namespaces) {
    this.debug('Getting "http" routes');
    var length = namespaces.length;
    var module;
    var name;
    for (var i = 0; i < length; i++) {
      module = this.getModule(namespaces[i]);
      name = this.getModuleName(namespaces[i]);
      if (!module.isInterface) {
        if (!module.url) {
          this.error('Route: "%s" doesn\'t have url property!', name);                    
        } else {
          this._setRoutes(protocolType, name, module);
        }
      }
    }
  },  

  _getRouteMethods: function(route, name) {
    var methods = {};
    var sm = this._supportedMethods;
    var length = sm.length;
    var single;
    var multiple;
    var type;
    this.debug('Getting "methods" for route "%s"', name);    
    for (var i = 0; i < length; i++) {
      type = sm[i].toLowerCase();
      single = type + 'SingleRecord';
      multiple = type + 'MultipleRecords';
      if (typeof route[single] === 'function') {
        methods[single] = route[single];
      }
      if (typeof route[multiple] === 'function') {
        methods[multiple] = route[multiple];
      }     
    };
    return methods;
  },  

  _setRoutes: function(protocolType, name, route) {
    var routeProtocolType;
    var methods;
    this.debug('Setting "http" route "%s"', name);    
    if (name === 'fourOhFour') {
      // assign 404 route
      this._routes[route.url] = {};
      this._routes[route.url].all = route.all;      
    } else {
      // get route supported methods - get, post etc..
      methods = this._getRouteMethods(route, name);
      routeProtocolType = this.getProtocolType(route.protocolType, name);
      if (protocolType === routeProtocolType) {
        // check if there is any methods for this route
        if (this._routeHasMethods(methods)) {
          return this._routes[route.url] = {
            methods: methods,
            scope: route
          };
        }
        this.error('Route: ' + name + ' doesn\'t have any methods!');        
      }
    }
  },  

  _routeHasMethods: function(methods) {
    for (var x in methods) {
      if (methods[x]) {
        return true;
      }
    }
    return false;
  }   
};
