module.exports = {
  allSettled: function(promises) {
    if (!Array.isArray(promises)) {
      throw new Error(
        'The input to "allSettled()" should be an array of Promise or values'
      );
    } 
    var promise = this.defer();
    var length = promises.length + 1;
    var counter = length;
    var data = [];
    var that = this;
    for (var i = 0; i < length; i++) {
      counter--;
      if (promises[i] && promises[i].____isPromiseObject) {
        promises[i].then(function(result) {
          that._resolvePromise(promise, data, result, 'fulfilled', counter);
        })
        .fail(function(e) {
          that._resolvePromise(promise, data, e, 'rejected', counter);                        
        });
      } else {
        data.push({
          state: 'fulfilled',
          value: promises[i]
        });         
      }
    };
        return promise;
  },  
  defer: function() {
    var that = this;
    return {
      ____isPromiseObject: true,
      _parentScope: null,
      _data: null,
      _state: {
        status: 'pending'
      },
      _callbacks: [],
      _enablePrivateAPI: function() {
        this._data = that._data;
        this._callbackLoop = that._callbackLoop;
        this._resolveRejected = that._resolveRejected;
        this._nextTick = that._nextTick;
        this._isPromise = that._isPromise;
        this._runParent = that._runParent;
        this._resolve = that._resolve;
      },
      then: function(fn, errFn) {
        return that._then.call(this, fn, errFn);    
      },
      fail: function(fn) {
        return that._fail.call(this, fn);
      },
      makeNodeResolver: function() {
        var self = this;
        this._enablePrivateAPI();
        return function(error, data) {
          return that._makeNodeResolver.call(self, error, data);
        }
      },
      resolve: function(data) { 
        this._enablePrivateAPI();
        this._resolve(data);
        return {
          state: this._state.status
        }
      },  
      cancel: function() {
        this._callbacks.length = 0;
        this._parentScope = null;
      }               
    }     
  },
  _resolvePromise: function(promise, data, result, state, counter) {
    data.push({
      state: state,
      value: result
    });
    if (counter == 0) {
      promise.resolve(data);
    }      
  },
  _resolveRejected: function(error, data) {
    this._state.status = 'rejected';
    if (typeof this._rejectedCallback === 'function') {
      this._callbacks = [this._rejectedCallback];
      this._rejectedCallback = undefined;
      return this._callbackLoop(error);
    }
    if (this._isPromise(this._parentScope)) {
      return this._runParent(error, data, this._parentScope);
    }   
    throw new Error(error);
  },
  _makeNodeResolver: function(error, data) {
    if (error) {
      return this._resolveRejected(error, data);
    }
    return this._resolve(data);
  },  
  _resolve: function(data) {
    this._callbackLoop(data);
  },
  _then: function(fn, errFn) {
    if (typeof fn === 'function') {
      this._callbacks.push(fn);
    }
    if (typeof errFn === 'function') {
      this._rejectedCallback = errFn; 
    }
    if (this.state === 'fulfilled') {
      this._resolve(this.data);
    }
    return this;  
  },
  _fail: function(fn) {
    if (typeof fn === 'function') {
      this._rejectedCallback = fn;      
    }
    return this;
  },
  _callbackLoop: function(data) { 
    if (this._callbacks.length) {
      var fn = this._callbacks[0];
      this._callbacks = this._callbacks.slice(1);
      return this._nextTick(fn, data);
    }
    if (this._isPromise(this._parentScope)) {
      return this._runParent(undefined, data, this._parentScope);
    }
    this._state.status = 'fulfilled';
  },
  _nextTick: function(fn, data) {
    try {
      var result = fn.call({}, data);
      if (this._isPromise(result)) {
        result._parentScope = {
          ____isPromiseObject: true,
          _callbacks: this._callbacks,
          _state: this._state,
          _rejectedCallback: this._rejectedCallback,
          _parentScope: this._parentScope
        }
        return;
      }
      return this._callbackLoop(result);
    } catch(error) {
      return this._resolveRejected(error, data);
    }
  },
  _isPromise: function(promise) {
    if (promise && promise.____isPromiseObject) {
      return true;
    }
    return false;
  },
  _runParent: function(error, data, scope) {
    this._callbacks = scope._callbacks;
    this._rejectedCallback = scope._rejectedCallback;
    this._parentScope = scope._parentScope;
    this._state = scope._state;
    if (error) {
      return this._resolveRejected.call(this, error, data);
    } 
    return this._callbackLoop.call(this, data);
  }
};