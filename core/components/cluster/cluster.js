'use strict';
module.exports = {
  extends: [
    'core.components.logger.logger',
    'core.components.inheritance.api'
  ],
  _stringHash: {},
  _workers: [],

  init: function(servers, config) {
    if (config.cluster.enabled === true || this._isUsingWebSockets(config.servers)) {
      this._cluster = this.includeModuleIfNotIncluded('cluster', 'cluster');
      this._net = this.includeModuleIfNotIncluded('net', 'net');
      this._stringHash = this.includeModuleIfNotIncluded('string-hash', 'stringHash');
      this._runCluster(servers, config.cluster.cores);
    }
  }, 

  _isUsingWebSockets: function(servers) {
    if (servers.http.enabled === true && servers.https.enabled === true &&
      servers.http.webSocket === true && servers.https.secureWebSocket === true) 
    {
      return true;
    }
    return false;
  },   

  _needBalancer: function(servers) {
    for (var x in servers) {
      return true;
    }
    return false;
  }, 

  _runCluster: function(servers, cores) {
    if (config.cluster.enabled !== true) {
      this.error('In order to use webSocket and secureWebSocket at one istance'
      + ' you have to enable cluster and set at least 1 core in config.json');
      process.exit();      
    }
    if (this._needBalancer(servers)) {
      return this._runBalancerCluster(servers, cores);
    }
    return this._runNormalCluster(cores);

  },

  _runNormalCluster: function(cores) {
    if (this._cluster.isMaster) {
      this._fork(cores);      
    } 
  }, 

  _runBalancerCluster: function(servers, cores) {
    if (this._cluster.isMaster) {
      for (var port in servers) {
        this._master(port, servers[port].protocol);
        this._emitListening(servers[port].server, cores);
      }
      return this._fork(cores);
    }
    this._slave(servers);    
  }, 

  _emitListening: function(server, cores) {
    for (var i = 0; i < cores; i++) {
      server.emit('listening', '');
    }
  }, 

  _balancer: function(socket, port) {
    var workerId = this._getHash(socket.remoteAddress || '127.0.0.1') % this._workers.length;
    this.debug('Sending socket to worker');
    this._workers[workerId].send('sticky:balance:' + port, socket);
  },  

  _master: function(port, protocol) {    
    var that = this;
    var options = { pauseOnConnect: true };
    this.debug('Initializing proxy server for "%s" on port "%s"', protocol, port);
    this._net.createServer(options, function(socket) {
      that._balancer(socket, port);
    }).listen(port);
  }, 

  _slave: function(servers) {
    process.on('message', function(message, socket) {
      if (message.indexOf('sticky:balance') !== 0 || !socket) {
        return;
      }
      var port = message.split(':')[2];
      servers[port].server.emit('connection', socket);
    });        
  }, 

  _fork: function(cores) {
    var worker;
    for (var i = 0; i < cores; i++) {
      worker = this._cluster.fork();
      this._onForked(worker);
    };
  },

  _getHash: function(string) {
    return this._stringHash(string);
  },  

  _onForked: function(worker) {
    var that = this;
    this._workers.push(worker);
    this.debug('Worker with id "%s" was just spawned', worker.id);
    worker.on('exit', function() {
      that._onWorkerExit(worker);
    });
  }, 

  _onWorkerExit: function(worker) {
    var index = this._workers.indexOf(worker);
    this.warning('Worker with id "%s" just exist', worker.id);
    if (index !== -1) {
      this._workers.splice(index, 1);
    }
    this._fork(1);
  }
}; 