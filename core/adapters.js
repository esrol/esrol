'use strict';
module.exports = {
  extends: ['core.utilities', 'core.logger'],
  init: function(app, namespaces) {
    this.debug('Initializing "adapters"');
    this._getAdapters(app, namespaces);
  },
  _getAdapters: function(app, namespaces) {
    var length = namespaces.length;
    var adapter;             
    this.debug('Getting "adapters"');
    for (var i = 0; i < length; i++) {
      adapter = this.findModule(app, namespaces[i]);
      if (typeof adapter.init === 'function') {
        adapter.init();
      } else {
        this.error(
          'Adapter', 
          this.getModuleName(namespaces[i]), ' doesn\'t have init method!'
        );
      }
    };  
  },
};