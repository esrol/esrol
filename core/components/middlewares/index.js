'use strict';
module.exports = {
  needInitializationByInitializer: false,
	factory: function(use) {
		this._middlewares = use('core.components.middlewares.middlewares');
	}, 
  init: function(protocolType) {
  	if (protocolType) {
	  	this._middlewares.init(protocolType);
	  	return this._middlewares.getQueue();
  	}
  }, 
};
