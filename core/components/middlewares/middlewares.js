'use strict';
module.exports = {
  extends: [
    'core.components.logger.logger', 
    'core.components.inheritance.api',
    'core.components.utilities.mixins'
  ],
  _middlewareNamespaces: [],
  _queue: [],

  factory: function(use) {
    this._middlewareNamespaces = use('core.components.initializers.initializer.middlewareNamespaces');
  }, 

  init: function(protocolType) {
    this._resetQueue();
    this._getProtocolMiddlewares(protocolType);
  }, 

  getQueue: function() {
    return this._queue;
  }, 

  _resetQueue: function() {
    this._queue = [];
  }, 

  _getProtocolMiddlewares: function(protocolType) {
    var middlewares = this._getMiddlewares(protocolType);
    this._sortMiddlewaresByPriority(middlewares); 
    this._setProtocolMiddlewares(middlewares);
  },

  _setProtocolMiddlewares: function(middlewares) {
    this._pushMiddlewaresIntoQueue(middlewares);     
  },

  _getMiddlewares: function(type) {
    var namespaces = this._middlewareNamespaces
    var length = namespaces.length;
    var middleware = {};
    var middlewares = [];
    var module;
    var protocolType;
    var middlewareName;
    type = type.toLowerCase();
    this.debug('Getting "middlewares" for protocol type "%s"', type);
    for (var i = length - 1; i >= 0; i--) {
      module = this.getModule(namespaces[i]);
      middlewareName = this.getModuleName(namespaces[i]);
      protocolType = this.getProtocolType(module.protocolType, middlewareName);
      if (type === protocolType) {
        if (typeof module.init === 'function' && typeof module.priority === 'number') {
          middleware = {
            scope: module,
            priority: module.priority,
            init: module.init()
          }
          middlewares.push(middleware);
          namespaces.splice(i, 1);
        } else {
          this.error('Middleware %s should have priority property with int value and init method!', middlewareName);
        }
      }
      if (!protocolType) {
        namespaces.splice(i, 1);
      }
    }
    return middlewares;    
  }, 

  _sortMiddlewaresByPriority: function(middlewares) {
    // higher priority win 
    this.debug('Sorting "middlewares" by priority, higher win');
    middlewares.sort(function(a, b) {
      return b.priority > a.priority
    });     
  }, 

  _pushMiddlewaresIntoQueue: function(middlewares) {
    var length = middlewares.length;
    this.debug('Setting "middlewares" into queue');
    for (var i = 0; i < length; i++) {
      this._queue.push({
        scope: middlewares[i].scope,
        fn: middlewares[i].init
      });
    };  
  },  
}
