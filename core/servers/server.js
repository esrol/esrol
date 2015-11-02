'use strict';
module.exports = {
  // exposing servers
  serverInstances: {
    tcp: {
      instance: null
    },
    udp: {
      instance: null
    },
    http: {
      instance: null
    },
    https: {
      instance: null
    },
    webSocket: {
      instance: null
    }   
  },
  _httpClusterRunned: false,

  _onServerListening: function(type, port) {
    this.info('%s Server running on port %s', type.toUpperCase(), port);    
  }, 

};