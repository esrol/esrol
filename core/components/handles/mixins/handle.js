'use strict';
module.exports = {
  extends: [
    'core.components.inheritance.api',
    'core.components.logger.logger'
  ], 
  _config: {},
  _handle: {},

  factory: function(use) {
    this._config = use('config');
  },  

  getHandle: function() {
    return this._handle;
  }, 

  _setHandle: function(module) {
    this._handle.scope = module;
    this._handle.handle = module.handle;     
  }, 

  _resetHandle: function() {
    this._handle = {};
  },     

  _getSocketModule: function() {
    var namespace = 'sockets.' + this._protocolType;
    this.debug('Getting "socket" handle for type: "%s"', this._protocolType);
    return this.getModule(namespace);    
  },   
  
  _findHandle: function() {
    var module = this._getSocketModule();
    this.debug('Setting "socket" handles for type: "%s"', this._protocolType);
    if (!module || typeof module.handle !== 'function') {
      return this.error(
        'In order to consume %s webSocket, you need to have "%s.js" file with "handle"'
        + ' method, positioned into projectDir/sockets/ directory', 
        this._protocolType, 
        this._protocolType
      )
    } 
    this._setHandle(module);
  },    
}; 