'use strict';
module.exports = {
  factory: function(use) {
    this.http = use('core.servers.http');
    this.https = use('core.servers.https');
    this.tcp = use('core.servers.tcp');
    this.udp = use('core.servers.udp');
  }, 
  init: function(app) {
    var servers = app.config.servers;
    if (servers.http.enabled) {
      this.http.create(app);  
    }
    if (servers.https.enabled) {
      this.https.create(app);      
    }   
    if (servers.tcp.enabled) {
      this.tcp.create(app);
    }
    if (servers.udp.enabled) {
      this.udp.create(app);
    }   
  },  
};
