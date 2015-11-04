'use strict';
module.exports = {
  getProtocolType: function(protocolType, name) {
    this.debug('Getting "protocol type" for module "%s" and current type: "%s"', name, protocolType);
    protocolType = protocolType ? protocolType.toLowerCase() : '';
    if (protocolType === 'http') {
      return 'http';
    } else if (protocolType === 'https') {
      return 'https';      
    } else if (protocolType === 'tcp') {
      return 'net';
    } else if (protocolType === 'udp') {
      return 'udp';
    } else if (protocolType === 'websocket') {
      return 'websocket';
    } else if (protocolType !== '') {
      this.error('Unsupported server protocol type: "%s" for module: %s', protocolType, name);
      return false;
    }
    return 'http';
  },     
};
