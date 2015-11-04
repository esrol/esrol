'use strict';
module.exports = {
  init: function(app) {
    var inheritanceInstance = app.core.components.inheritance.inheritance;
    this._imitateInheritance(app, inheritanceInstance);
    this._setPublicAPI(app, inheritanceInstance);
  }, 

  _setPublicAPI: function(app, inheritance) {
    var api = app.core.components.inheritance.api;
    api.getModule = inheritance._getModule;    
    api.setValueToObjectFromApp = inheritance._setValueToObjectFromApp;    
    api.includeModuleIfNotIncluded = inheritance._includeModuleIfNotIncluded;    
    api.getModuleName = inheritance._getModuleName;    
  }, 

  _imitateInheritance: function(app, inheritanceInstance) {
    inheritanceInstance._makePrimitiveInheritance(app);    
    inheritanceInstance._bindParamAndScopeForPublicAPI(app);
  }, 

  beginInheritance: function(app, factoriesAndInheritance) {
    app.core.components.inheritance.inheritance.onInitializationFinished(factoriesAndInheritance);
  }
}; 