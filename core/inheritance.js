'use strict';
module.exports = {
  _alreadyInherited: {},
  _logger: {},
  _findModule: function() {},  
  getObjectFromNamespace: function() {},
  getNamespacesAsArray: function() {},
  getObjectFromApp: function() {},

  init: function(app) {
      // we somehow extends to start the inheritance..
    this._makePrimitiveInheritance(app);
    this._bindParamAndScope(app);
  },
 

  onInitializationFinished: function(factories) {
    this._enableFactory(factories);
    this._enableInheritance(factories);    
  },

  // the app param and "this" are binded - see bellow
  publicGetterMethod: function(app, namespace) {
    this._logger.debug('Getting module from namespace "%s"', namespace);
    var object = this._findModule(app, namespace);
    if (typeof object !== 'undefined') {
      return object;
    }
    this._logger.error('The following namespace: "%s" is invalid.', namespace);
  },

  // the app param and "this" are binded - see bellow
  publicSetterMethod: function(app, namespace, value) {
    this._logger.debug(
      'Setting value: "%s" into namespace: "%s"', 
      value, 
      namespace
    );
    var namespace = this.getNamespacesAsArray(namespace);
    var property = namespace.pop();
    var object = this._findModule(app, namespace.join('.'));
    object[property] = value;
  }, 

  // binding here
  _bindParamAndScope: function(app) {
    this.publicGetterMethod = this.publicGetterMethod.bind(this, app);
    this.publicSetterMethod = this.publicSetterMethod.bind(this, app);    
  },

  _makePrimitiveInheritance: function(app) {
    this.getObjectFromNamespace = app.core.utilities.getObjectFromNamespace;
    this.getObjectFromApp = app.core.utilities.getObjectFromApp;
    this._findModule = app.core.utilities.findModule;
    this.getNamespacesAsArray = app.core.utilities.getNamespacesAsArray;   
    this._logger = app.core.logger;     
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

  _beginInheritance: function(modulesFrom, namespaceTo) {
    var hash;
    var moduleFrom;
    var namespaceFrom;
    var length = modulesFrom.length;
    var moduleTo = this.publicGetterMethod(namespaceTo);
    if (!moduleTo.extends) {
      return;
    } 
    for (var i = 0; i < length; i++) {
      namespaceFrom = modulesFrom[i];
      moduleFrom = this.publicGetterMethod(namespaceFrom);
      if (moduleFrom) {                
        if (moduleFrom.extends) {
          this._beginInheritance(moduleFrom.extends, namespaceFrom);
          moduleFrom.extends = undefined;
        }
        this._mergeObjects(moduleFrom, moduleTo, namespaceFrom, namespaceTo);                       
      } else {
        this._logger.error(
          'The following namespace: "%s" is invalid.', 
          modulesFrom[i]
        );
      }
    }      
  },

  _mergeObjects: function(moduleFrom, moduleTo, namespaceFrom, namespaceTo) {
    var hash = namespaceFrom + namespaceTo; 
    if (this._alreadyInherited[hash]) {
      return;
    }
    this._logger.debug(
      'Module "%s" inherit from "%s"', 
      namespaceTo, 
      namespaceFrom
    );
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

  _runFunctionFactory: function(factory, namespace) {
    var scope;
    namespace = namespace.split('.');
    scope = this.publicGetterMethod(namespace);  
    factory.call(scope, this.publicGetterMethod); 
  },

};
 