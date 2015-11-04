'use strict';
module.exports = {
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
      return this._runReqResBasedMiddlewares(req, res, this._routes[url].methods[method], this._routes[url].scope, this._queue);
    }
    // if we have global 404 route, use it
    if (this._routes['fourOhFour']) {
      return this._runReqResBasedMiddlewares(req, res, this._routes['fourOhFour']['all'], this._routes['fourOhFour'], this._queue);      
    }
    res.statusCode = 404;
    return res.end();
  },

  // if we're here, we're sure that there is existing route with method to handle the request, so we can run the middlewares
  _runReqResBasedMiddlewares: function(req, res, route, routeScope, queue) {
    var nextFnNumber = 0;
    this.debug('Moving through http middlewares, current fn index is: %s, queue length: %s', nextFnNumber, queue.length);
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

  _getMiddlewares: function() {
    var queue = this._middlewares.init(this._protocolType);
    var length = queue.length;
    for (var i = 0; i < length; i++) {
      this._queue.push(queue[i]);
    };
  }, 

  _getRoutes: function() {
    var routes = this._httpRoutes.init(this._protocolType);
    for (var x in routes) {
      this._routes[x] = routes[x];
    }
  }, 

  _getMiddlewaresAndRoutes: function() {
    this._middlewares.getProtocolMiddlewares(this._protocolType); 
    this._httpRoutes.getRoutes();       
  }, 
         
}; 