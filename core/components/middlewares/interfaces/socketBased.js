'use strict';
module.exports = {
  runSocketBasedMiddlewares: function(socket, handle, handleScope, queue) {
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
};
