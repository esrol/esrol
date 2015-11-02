'use strict';
module.exports = {
	extends: [
		'core.servers.server', 
		'core.servers.mixins.http', 
		'core.routers.http'
	],
	implements: ['core.servers.interfaces.server'],
	create: function(app) {
		var config = app.config.servers.http;
		var that = this;
		var port;
		var server;
		this.includeModuleIfNotIncluded(app, 'http', 'http');
		// if (app.config.benchmarks.enable) {
		if (false) { // todo FIX THIS
			this._createServerForBenchMarks(app);
		} else {
	    port = config.port;
	    server = app.vendors.http.createServer(function(req, res) {
	    	that.router(req, res);
	    });
	   	if (app.config.cluster) {
	   		this.debug('Initializing "http" server in cluster mode');
	   		this.serverInstances.http.instance = server;	   		
	   		this._runHTTPCluser(app, 'http', config);
			} else {
	   		this.debug('Initializing "http" server');					
				server.listen(port, function() {	
		   		that.serverInstances.http.instance = server;	   		
					that._onHTTPListening(app, 'http', config);
				});
			} 
			// this.success('success message');			
			// this.badrequest('badrequest message');			
			// this.debug('debug message');			
			// this.notice('notice message');			
			// this.info('info message');			
			// this.alert('alert message');			
			// this.unauthorized('unauthorized message');			
			// this.warning('warning message');			
			// this.emergency('emergency message');			
			// this.critical('critical message');			
			// this.error('error message');			
		}	
	}, 	
};
