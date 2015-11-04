'use strict';
module.exports = {

  router: function(socket) {
    this._runSocketBasedMiddlewaresockets(socket, this._handle.handle, this._handle.scope, this._queue)
  }, 

  _runSocketBasedMiddlewaresockets: function(socket, handle, handleScope, queue) {
    var nextFnNumber = 0;
    this.debug('Moving through socket middlewares, current fn index is: %s', nextFnNumber);
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

  _setHandle: function() {
    var handle = this._handles.getHandle();
    this._handle.scope = handle.scope;
    this._handle.handle = handle.handle;
  }, 

  _setMiddlewares: function() {
    var queue = this._middlewares.init(this._protocolType);
    var length = queue.length;
    for (var i = 0; i < length; i++) {
      this._queue.push(queue[i]);
    };
  },    
}; 