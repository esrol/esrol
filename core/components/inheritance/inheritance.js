'use strict';
module.exports = {
  _alreadyInherited: {},
  _logger: {},
  getObjectFromNamespace: function() {},

  onInitializationFinished: function(factories) {
    this._enableFactory(factories);
    this._enableInheritance(factories);    
  },

  _getObjectFromNamespace: function(app, namespace, namespaces) {
    if (app[namespace]) {
      namespaces = namespaces.slice(1);
      return this._getObjectFromApp(app, namespaces, app[namespace]);
    }    
  },
  _getObjectFromApp: function(app, namespaces, obj) {
    var namespace = namespaces[0];
    if (namespace) {
      if (obj) {
        return this._getObjectFromNamespace(obj, namespace, namespaces)
      } else {
        return this._getObjectFromNamespace(app, namespace, namespaces)
      }   
    }
    return obj;
  },

  _getNamespacesAsArray: function(namespaces) {
    if (!Array.isArray(namespaces) && namespaces) {
      namespaces = namespaces.split('.');
    }  
    return namespaces || [];  
  },      

  _makePrimitiveInheritance: function(app) {
    this._setLoggerInstance(app);  
  }, 

  _enableFactory: function(factories) {
    this._logger.debug('Running "factories"');
    for (var x in factories) {
      if (factories[x].factory) {
        this._runFunctionFactory(factories[x].factory, x);
      }
    } 
  },

  _enableInheritance: function(factories) {
    this._logger.debug('Running "inheritance"');
    for (var x in factories) {
      if (factories[x].extends) {
        this._beginInheritance(factories[x].extends, x);
      }
    }       
  },

  _findModule: function(app, namespaces) {
    namespaces = this._getNamespacesAsArray(namespaces);
    return this._getObjectFromApp(app, namespaces);
  },  

  // binding here
  _bindParamAndScopeForPublicAPI: function(app) {
    this._getModule = this._getModule.bind(this, app);
    this._getModuleName = this._getModuleName.bind(this);
    this._includeModuleIfNotIncluded = this._includeModuleIfNotIncluded.bind(this, app);
    this._setValueToObjectFromApp = this._setValueToObjectFromApp.bind(this, app);    
  },   

  _beginInheritance: function(modulesFrom, namespaceTo) {
    var hash;
    var moduleFrom;
    var namespaceFrom;
    var length = modulesFrom.length;
    var moduleTo = this._getModule(namespaceTo);
    if (!moduleTo.extends) {
      return;
    } 
    for (var i = 0; i < length; i++) {
      namespaceFrom = modulesFrom[i];
      moduleFrom = this._getModule(namespaceFrom);
      if (moduleFrom) {                
        if (moduleFrom.extends) {
          this._beginInheritance(moduleFrom.extends, namespaceFrom);
          moduleFrom.extends = undefined;
        }
        this._mergeObjects(moduleFrom, moduleTo, namespaceFrom, namespaceTo);                       
      }
    }      
  },

  _mergeObjects: function(moduleFrom, moduleTo, namespaceFrom, namespaceTo) {
    var hash = namespaceFrom + namespaceTo; 
    if (this._alreadyInherited[hash]) {
      return;
    }
    this._logger.debug('Module "%s" inherit from "%s"', namespaceTo, namespaceFrom);
    this._alreadyInherited[hash] = true;    
    for (var x in moduleFrom) {
      if (!moduleTo.hasOwnProperty(x)) { 
        moduleTo[x] = moduleFrom[x];
      } else {
        if (x !== 'extends' && x !== 'implements' && x !== 'factory') {
          this._logger.warning(
            '"%s" exists in both "%s" and "%s".' 
            + ' This can increase the complexity and ambiguity', 
            x, 
            namespaceFrom, 
            namespaceTo);          
        }
      }
    }
  },

  _getModule: function(app, namespace) {
    this._logger.debug('Getting module from namespace "%s"', namespace);
    var object = this._findModule(app, namespace);
    if (typeof object !== 'undefined') {
      return object;
    }
    this._logger.error('The following namespace: "%s" is invalid.', namespace);
  },

  _setValueToObjectFromApp: function(app, namespace, value) {
    this._logger.debug('Setting value: "%s" into namespace: "%s"', value, namespace);
    var namespace = this._getNamespacesAsArray(namespace);
    var property = namespace.pop();
    var object = this._findModule(app, namespace.join('.'));
    object[property] = value;
  },  

  _getModuleName: function(namespaces) {
    namespaces = this._getNamespacesAsArray(namespaces);
    return namespaces.pop();    
  },

  _includeModuleIfNotIncluded: function(app, module, alias) {
    if (!app.vendors[module] || !app.vendors[alias]) {
      try {
        app.vendors[alias] = require(module);
        return app.vendors[alias];
      } catch(e) {
        this._logger.error('Unable to load npm module %s', module);
        return false;
      }
    }
    return app.vendors[module] || app.vendors[alias];
  },     

  _runFunctionFactory: function(factory, namespace) {
    var scope;
    namespace = namespace.split('.');
    scope = this._getModule(namespace);  
    factory.call(scope, this._getModule); 
  },

  _setLoggerInstance: function(app) {
    this._logger = app.core.components.logger.logger;
  },   

};
 