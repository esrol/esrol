'use strict';
module.exports = {
  _fsModule: null,
  _pathModule: null,
  _applicationPath: null,
  _currentFileName: null,
  // this actually is the app object, but since we're passing both of them as param
  // to the same functions, we need different names
  _lib: {},
  _factoriesAndInheritance: {},
  _adapterNamespaces: [],
  _middlewareNamespaces: [],
  _routeNamespaces: [],
  _interfaceNamespaces: {},
  _dirsToInclude: [],  
  init: function(fsModule, pathModule, path, config) {
    config = this._onInitSetProperties(fsModule, pathModule, path, config);
    this._resolvePath(path);
    this._loopThroughDirsAndFiles(this._dirsToInclude, path, config.filesToSkip);
    this._includeModules(config.modules);
    this._lib.vendors.fs = fsModule;
    this._lib.vendors.path = pathModule;
    return {
      modules: this._lib,
      _routeNamespaces: this._routeNamespaces,
      _adapterNamespaces: this._adapterNamespaces,
      _interfaceNamespaces: this._interfaceNamespaces,
      _middlewareNamespaces: this._middlewareNamespaces,
      _factoriesAndInheritance: this._factoriesAndInheritance,
    };         
  },
  _resolvePath: function(path) {
    if (!this._fsModule.existsSync(path)) {
      console.log('Error: Directory "' + path + '" does not exist!');
      process.exit(1);
    }   
  }, 
  _onInitSetProperties: function(fsModule, pathModule, path, config) {
    config.filesToSkip ? true : config.filesToSkip = {};
    config.modules ? true : config.modules = {};
    this._applicationPath = path;
    this._fsModule = fsModule;
    this._pathModule = pathModule;
    this._dirsToInclude = config.directories;
    this._currentFileName = pathModule.basename(__filename);
    return config;
  },
  _includeModules: function(modules) {
    this._lib['vendors'] = {};
    for (var x in modules) {
      try {
        if (modules.hasOwnProperty(x)) {
          this._lib['vendors'][x] = require(modules[x]);                    
        }
      } catch (error) {
        console.log('Error: ' + error.message + ', module alias: ' + x);
      } 
    }        
  },
  _includeFromPath: function(path, filesToSkip) {
    this._loopThroughDirsAndFiles(this._fsModule.readdirSync(path), path, filesToSkip);
  },
  _loopThroughDirsAndFiles: function(files, path, filesToSkip) {
    var length = files.length;
    var fileName;
    for (var i = 0; i < length; i++) {
      fileName = files[i];
      if (fileName != this._currentFileName && 
        (filesToSkip[fileName] == undefined ||
        filesToSkip[fileName].toLowerCase() !== 'skip')) 
      {
        this._getFileStatus(fileName, path, filesToSkip);
      }
    }        
  },
  _getFileStatus: function(file, path, filesToSkip) {
    var splitedFile;    
    var status;    
    var namespaces;    
    if (file !== 'node_modules' && file !== '.git') {
      status = this._fsModule.lstatSync(path + this._pathModule.sep + file);
      namespaces = path.replace(this._applicationPath, '').split(this._pathModule.sep);
      if (status.isDirectory()) {
        this._includeFromPath(path + this._pathModule.sep + file, filesToSkip);
      } else {
        splitedFile = file.split('.');
        if (splitedFile[1].toLowerCase() == 'js') {   
          // lib[splitedFile[0]] = require(path + pathModule.sep + file); 
          this._processFile(this._lib, namespaces, path, file, splitedFile[0]);                  
        }
      }            
    }         
  },
  _processFile: function(app, namespaces, path, file, fileName) {
    var parentKey;
    var length = namespaces.length;
    for (var i = 0; i < length; i++) {
      if (namespaces[i] === '') {
        namespaces.splice(i, 1);
      }
    }    
    length = namespaces.length;
    for (var i = 0; i < length; i++) {
      parentKey = namespaces[i];
      if (!app[parentKey]) {
        app[parentKey] = {};                                        
      }
      namespaces.splice(i, 1);
      if (namespaces.length) {
        // we need to move at least one level deeper to get the module
        return this._processFile(app[parentKey], namespaces, path, file, fileName);           
      } else {
        return this._includeFile(app, parentKey, path, file, fileName);               
      }
    };       
  },
  _includeFile: function(app, parentKey, path, file, fileName) {
    var obj;
    var namespace;  
    app[parentKey][fileName] = {};
    path = path + this._pathModule.sep + file;
    namespace = this._getNamespaceWithDots(path, namespace);
    obj = require(path);
    this._pushObjectsIntoApp(app, obj, parentKey, fileName, namespace);              
    return app;        
  }, 
  _getNamespaceWithDots: function(path, namespace) {
    // first replace the application path from the module path, then replace the OS path separators (/ or \) with .
    // finally, remove .js ext from the module path and return the namespace eg: core.routers.http
    return path.replace(this._applicationPath, '').split(this._pathModule.sep).join('.').slice(1).slice(0, -3);
  }, 
  _pushObjectsIntoApp: function(app, obj, parentKey, fileName, namespace) {
    for (var x in obj) {
      app[parentKey][fileName][x] = obj[x];
    }      
    this._pushDependencies(app, parentKey, fileName, namespace);        
  },
  _pushDependencies: function(app, parentKey, fileName, namespace) {
    if (namespace.indexOf('adapters.') === 0) {
      this._pushAdapterNamespaces(namespace);                   
    } else if (namespace.indexOf('middlewares.') === 0) {
      this._pushMiddlewareNamespaces(namespace);                   
    } else if (namespace.indexOf('routes.') === 0) {
      this._pushRouteNamespaces(app, parentKey, fileName, namespace);                   
    }  
    if (app[parentKey][fileName].interface) {
      this._pushInterfaceNamespaces(app, parentKey, fileName, namespace);                         
    }
    this._pushFactoryNamespaces(app, parentKey, fileName, namespace);                           
  }, 
  _pushInterfaceNamespaces: function(app, parentKey, fileName, namespace) { 
    this._interfaceNamespaces[namespace] = app[parentKey][fileName].interface;
  },  
  _pushAdapterNamespaces: function(namespace) {        
    this._adapterNamespaces.push(namespace);
  }, 
  _pushMiddlewareNamespaces: function(namespace) {
    this._middlewareNamespaces.push(namespace);
  }, 
  _pushRouteNamespaces: function(app, parentKey, fileName, namespace) {
    this._routeNamespaces.push(namespace);                
  }, 
  _pushFactoryNamespaces: function(app, parentKey, fileName, namespace) {
    var module = app[parentKey][fileName];
    this._factoriesAndInheritance[namespace] = {};    
    if (module.extends) {
      this._factoriesAndInheritance[namespace].extends = module.extends;      
    }
    if (module.factory) {
      this._factoriesAndInheritance[namespace].factory = module.factory;      
    }
    if (module.implements) {
      this._factoriesAndInheritance[namespace].implements = module.implements;      
    }   
  }, 
};
