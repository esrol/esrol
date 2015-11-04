'use strict';
module.exports = {
  extends: ['core.components.handles.mixins.handle'],
  implements: ['core.components.handles.interfaces.handle'],
  _protocolType: 'webSocket',

  init: function() {
    if (this._config.servers.http.webSocket !== true) {
      return;
    }
    this._resetHandle();
    this._findHandle();
  }, 

}; 