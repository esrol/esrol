'use strict';
module.exports = {
  extends: ['core.components.interfaces.interfaces'],
  init: function(factoriesAndInheritance, interfaces) {
    this._setInterfaces(interfaces);
    this._loopThroughFactories(factoriesAndInheritance);
  }, 
};
