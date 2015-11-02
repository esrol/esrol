'use strict';
module.exports = {
	extends: ['core.logger'],
	_interfaces: null,
	init: function(factories, interfaces) {
		this._setInterfaces(interfaces);
		this._loopThroughFactories(factories);
	}, 
	factory: function(use) {
		this._getModuleFromNamespace = use('core.inheritance.publicGetterMethod');
	}, 
	_setInterfaces: function(interfaces) {
		this._interfaces = interfaces;
	}, 
	_loopThroughFactories: function(factories) {
		for (var x in factories) {
			if (factories[x].implements) {
				this._checkImplementsProperty(x, factories[x].implements);
			}
		}
	}, 
	_checkImplementsProperty: function(moduleName, shouldImplement) {
		if (typeof shouldImplement === 'string') {
			return this._moduleDidImplementInterface(moduleName, shouldImplement);
		}
		if (Array.isArray(shouldImplement)) {
			return this._loopThroughModuleInterfaces(moduleName, shouldImplement);
		}
		this.error(
			'Property "implements" of module "%s" should be string' 
			+' or array with interface namespaces', 
			moduleName
		);
	}, 
	_moduleDidImplementInterface: function(moduleName, interfacesNamespace) {
		var iFace = this._interfaces[interfacesNamespace];
		var length;
		var module;
		if (!iFace) {
			return this.error(
				'Interface with namespace "%s" was not found', 
				interfacesNamespace
			);
		}
		if (!Array.isArray(iFace)) {
			return this.error(
				'Interface with namespace "%s" should export'
				+ 'object with array property named "interface"', 
				interfacesNamespace
			);
		}
		module = this._getModuleFromNamespace(moduleName);
		for (var i = 0; i < iFace.length; i++) {
			if (!this._interfaceMethodIsCorrect(iFace[i])) {
				return this.error(
					'Each element of interface "%s" should be object with two properties:' 
					+ 'method(string) and arguments(array). '
					+ 'Eg: {method: "someMethodName", arguments: ["one", "two", "three"]}', 
					interfacesNamespace
				);
			}
			if (!this._methodIsImplementedCorrectly(module, iFace[i])) {
				return this.error(
					'Interface "%s" was not implemented correctly by module with namespace "%s".'
					+ 'The implementation needs method with name "%s" and "%s" argument(s)', 
					interfacesNamespace,
					moduleName,
					iFace[i].method,
					iFace[i].arguments
				);	
			}
		}
	}, 
	_loopThroughModuleInterfaces: function(moduleName, shouldImplement) {
		var length = shouldImplement.length;
		for (var i = 0; i < length; i++) {
			this._moduleDidImplementInterface(moduleName, shouldImplement[i]);
		}
	}, 
	_methodIsImplementedCorrectly: function(module, iMethod) {
		if (typeof module[iMethod.method] !== 'function') {
			return false
		}
		if (module[iMethod.method].length !== iMethod.arguments.length) {
			return false;
		}
		return true;
	},
	_interfaceMethodIsCorrect: function(iMethod) {
		if (!iMethod || 
			typeof iMethod.method !== 'string' || 
			!Array.isArray(iMethod.arguments)) 
		{
			return false;
		}
	 	return true;
	 },  
};
