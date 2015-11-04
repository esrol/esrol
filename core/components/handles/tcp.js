'use strict';
module.exports = {
  extends: ['core.components.handles.mixins.handle'],
  implements: ['core.components.handles.interfaces.handle'],
  _protocolType: 'tcp',

  init: function() {
    if (this._config.servers.tcp.enabled !== true) {
      return;
    }
    this._resetHandle();
    this._findHandle();
  }, 

}; 