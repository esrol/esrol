'use strict';
module.exports = {
	getObjectFromNamespace: function(app, namespace, namespaces) {
		if (app[namespace]) {
			namespaces = namespaces.slice(1);
			return this.getObjectFromApp(app, namespaces, app[namespace]);
		}    
	},
	getObjectFromApp: function(app, namespaces, obj) {
		var namespace = namespaces[0];
		if (namespace) {
			if (obj) {
				return this.getObjectFromNamespace(obj, namespace, namespaces)
			} else {
				return this.getObjectFromNamespace(app, namespace, namespaces)
			}		
		}
		return obj;
	},	
	getModuleName: function(namespaces) {
		namespaces = this.getNamespacesAsArray(namespaces);
		return namespaces.pop();		
	},
	findModule: function(app, namespaces) {
		namespaces = this.getNamespacesAsArray(namespaces);
		return this.getObjectFromApp(app, namespaces);
	}, 
	getNamespacesAsArray: function(namespaces) {
		if (!Array.isArray(namespaces) && namespaces) {
			namespaces = namespaces.split('.');
		}	 
		return namespaces || [];	
	},  
	includeModuleIfNotIncluded: function(app, module, alias) {
		if (!app.vendors[module] || !app.vendors[alias]) {
			try {
				app.vendors[alias] = require(module);
			} catch(e) {
				this.error('Unable to load npm module %s', name);
			}
		}
	}	
}; 