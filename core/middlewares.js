'use strict';
module.exports = {
  extends: ['core.utilities', 'core.logger'],
  // push middlewares into queue
  getProtocoloMiddlewares: function(app, namespaces, protocolType) {
    var middlewares = this._getMiddlewares(app, namespaces, protocolType);
    this._sortMiddlewaresByPriority(middlewares); 
    this._pushMiddlewaresIntoQueue(middlewares); 
  },
  // if we're here, we're sure that there is existing route 
  // with method to handle the request, so we can run the middlewares
  runReqResBasedMiddlewares: function(req, res, route, routeScope, queue) {
    var nextFnNumber = 0;
    this.debug(
      'Moving through http middlewares, current fn index is: %s, queue length: %s', 
      nextFnNumber, 
      queue.length
    );
    var next = function() {
      // check the queue
      if (queue[nextFnNumber]) {
        var fn = queue[nextFnNumber].fn;
        var scope = queue[nextFnNumber].scope;
        nextFnNumber++;
        fn.call(scope, req, res, next);   
      } else {
        // empty queue, go to the route
        route.call(routeScope, req, res);
      }
    };
    // call the queue loop
    next();
  },
  runSocketBasedMiddlewares: function(socket, handle, handleScope, queue) {
    var nextFnNumber = 0;
    this.debug(
      'Moving through socket middlewares, current fn index is: %s', 
      nextFnNumber
    );
    var next = function() {
      // check the queue
      if (queue[nextFnNumber]) {
        var fn = queue[nextFnNumber].fn;
        var scope = queue[nextFnNumber].scope;
        nextFnNumber++;
        fn.call(scope, socket, next);   
      } else {
        // empty queue, go to the handle
        handle.call(handleScope, socket);
      }
    };
    // call the queue loop
    next();    
  }, 
  _getMiddlewares: function(app, namespaces, type) {
    var middleware = {};
    var middlewares = [];
    var length = namespaces.length;
    var module;
    var protocolType;
    var middlewareName;
    this.debug('Getting "middlewares" for protocol type "%s"', type);
    for (var i = 0; i < length; i++) {
      module = this.findModule(app, namespaces[i]);
      middlewareName = this.getModuleName(namespaces[i]);
      protocolType = this._getProtocolType(module.protocolType, middlewareName);
      if (type === protocolType) {
        if (typeof module.init === 'function' && 
          typeof module.priority === 'number') 
        {
          middleware = {
            scope: module,
            priority: module.priority,
            init: module.init()
          }
          middlewares.push(middleware);
          namespaces.splice(i, 1);
        } else {
          this.error(
            'Middleware %s should have priority property with int value'
            + 'and init method!', 
            middlewareName
          );
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
      this.queue.push({
        scope: middlewares[i].scope,
        fn: middlewares[i].init
      });
    };    
  },
  _getProtocolType: function(protocolType, name) {
      this.debug(
        'Getting "protocol" type for module "%s" and current type: "%s"', 
        name, 
        protocolType
      );
      protocolType = protocolType ? protocolType.toLowerCase() : '';
      if (protocolType === 'http') {
        return 'http';
      } else if (protocolType === 'tcp') {
        return 'net';
      } else if (protocolType === 'udp') {
        return 'udp';
      } else if (protocolType === 'websocket') {
        return 'websocket';
      } else if (protocolType !== '') {
        this.error(
          'Unsupported server protocol type: "%s" for module: %s', 
          protocolType, 
          name
        );
        return false;
      }
      return 'http';
  },     
}
