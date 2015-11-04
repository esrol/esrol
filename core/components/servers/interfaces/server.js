'use strict';
module.exports = {
	interface: [
		{
			method: "init", 
			arguments: []
		},         
    {
      method: "includeModuleIfNotIncluded", 
      arguments: ["name", "alias"]
    },
    {
      method: "_createServer", 
      arguments: []
    }, 
	]
};
