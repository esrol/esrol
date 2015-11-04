'use strict';
module.exports = {
  extends: ['core.components.handles.mixins.handle'],
  implements: ['core.components.handles.interfaces.handle'],
  _protocolType: 'secureWebSocket',

  init: function() {
    if (this._config.servers.https.secureWebSocket !== true) {
      return;
    }
    this._resetHandle();
    this._findHandle();
  },   
}; 