'use strict';
module.exports = {
  getRoutes: function(app, namespaces) {
    this.debug('Getting "http" routes');
    var length = namespaces.length;
    var module;
    var name;
    for (var i = 0; i < length; i++) {
      module = this.findModule(app, namespaces[i]);
      name = this.getModuleName(namespaces[i]);
      if (!module.isInterface) {
        if (!module.url) {
          this.error('Route: ' + name + ' doesn\'t have url property!');                    
        } else {
          this._setRoutes(app, name, module);
        }        
      }
    }
  },  
  router: function(req, res) {
    var method;
    var string = req.url.split('?');
    var url = string[0];
    req.queryString = string[1];              
    // 100% match / for example test
    if (this._routes[url]) {
      method = req.method.toLowerCase() + 'MultipleRecords';
    } else {
      // check for route like /test/
      if (url[url.length - 1] === '/') {
        url = url.slice(0, -1); 
        // check again for exact match
        if (this._routes[url]) {
          method = req.method.toLowerCase() + 'MultipleRecords';
        }
      }
      if (!method) {
        // if there is still no match, check for single record like /test/someRecordName or /test/1
        url = url.split('/')
        req.record = url.pop();
        url = url.join('/');
        if (this._routes[url]) {
          method = req.method.toLowerCase() + 'SingleRecord';         
        }
      }
    }
    // this._setPrototypes(req, res);
    return this._dispatchRequest(req, res, url, method);
  },
  _dispatchRequest: function(req, res, url, method) { 
    if (method && this._routes[url].methods[method]) {
      // dispatch the request to the middleware
      return this.runReqResBasedMiddlewares(req, res, this._routes[url].methods[method], this._routes[url].scope, this.queue);
    }
    // if we have global 404 route, use it
    if (this._routes['fourOhFour']) {
      return this.runReqResBasedMiddlewares(req, res, this._routes['fourOhFour']['all'], this._routes['fourOhFour'], this.queue);      
    }
    res.statusCode = 404;
    return res.end();
  },  
  _setRoutes: function(app, name, route) {
    var protocolType;
    var methods;
    this.debug('Setting "http" route "%s"', name);    
    if (name === 'fourOhFour') {
      // assign 404 route
      this._routes[route.url] = {};
      this._routes[route.url].all = route.all;      
    } else {
      // get route supported methods - get, post etc..
      methods = this._getRouteMethods(route, name);
      protocolType = this._getProtocolType(route.protocolType, name);
      // check if there is any methods for this route
      if (this._routeHasMethods(methods) && protocolType === 'http') {
        // we can't inherit all server protocolType, since all of them has the same interface: routes, router, dispatcher
        return this._routes[route.url] = {
          methods: methods,
          scope: route
        };
      }
      this.error('Route: ' + name + ' doesn\'t have any methods!');
    }
  },
  _getRouteMethods: function(route, name) {
    var methods = {};
    var sm = this._supportedMethods;
    var length = sm.length;
    var single;
    var multiple;
    this.debug('Getting "methods" for route "%s"', name);    
    for (var i = 0; i < length; i++) {
      sm[i] = sm[i].toLowerCase();
      single = sm[i] + 'SingleRecord';
      multiple = sm[i] + 'MultipleRecords';
      if (typeof route[single] === 'function') {
        methods[single] = route[single];
      }
      if (typeof route[multiple] === 'function') {
        methods[multiple] = route[multiple];
      }     
    };
    return methods;
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