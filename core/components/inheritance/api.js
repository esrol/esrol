'use strict';
module.exports = {

  // the scope for this module is taken from inheritance.js

  // to be overwritten during initialization - the scope is binded
  getModule: function(namespaces) {},
  // to be overwritten during initialization - the scope and app param are binded
  setValueToObjectFromApp: function(app, namespace, value) {},

  // to be overwritten during initialization - the scope is binded
  getModuleName: function(namespaces) {},

  // to be overwritten during initialization - the scope and app param are binded
  includeModuleIfNotIncluded: function(app, module, alias) {},

}; 