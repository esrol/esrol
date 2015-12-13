'use strict';
let fs = require('fs');
let path = require('path');
let PackageToJson = require('./packageToJson');
let Transporter = require('./transporter');
let colors = require('colors');

module.exports = class Esrol {

  constructor(absPath, appPath) {
    let modulePath = path.join('node_modules', 'esrol');
    appPath = appPath || absPath.replace(path.join(modulePath, 'index.js'), '');
    let esrolPath = absPath.replace('index.js', '');
    let packagePath = path.join(appPath, 'package.json');
    let packageJson = {};
    if (fs.existsSync(packagePath)) {
      packageJson = new PackageToJson(packagePath);
    }
    this._createApp(packageJson, esrolPath, appPath);
  }

  _createApp(json, esrolPath, appPath) {
    if (json.config && json.config.esrol && json.config.esrol.installed) {
      return true;
    }
    return this._fullInstall(json, esrolPath, appPath);
  }

  _fullInstall(json, esrolPath, appPath) {
    let staticAppPath = path.join(esrolPath, 'apps', 'server');
    let staticPackageJsonPath = path.join(staticAppPath, 'esrol-package.json');
    let esrolJson = new PackageToJson(staticPackageJsonPath);
    new Transporter(staticAppPath, appPath)
    .then(() => {
      return this._unlinkFile(appPath, 'package.json');
    })
    .then(() => {
      return this._unlinkFile(appPath, 'esrol-package.json');
    })
    .then(() => {
      return this._mergeBothPackages(json, esrolJson);
    })
    .then(() => {
      return this._updateConfig(esrolJson);
    })
    .then(() => {
      return this._writePackageJson(esrolJson, appPath);
    })
    .then(() => {
      return this._done();
    });
  }

  _unlinkFile(appPath, name) {
    let file = path.join(appPath, name);
    if (fs.existsSync(file)) {
      fs.unlink(file);
    }
  }

  _mergeBothPackages(app, esrol) {
    if (app.dependencies) {
      for (let dep in esrol.dependencies) {
        if (!app.dependencies[dep] && dep !== 'esrol') {
          app.dependencies[dep] = esrol.dependencies[dep];
        }
      }
    }
    if (app.devDependencies) {
      for (let dep in esrol.devDependencies) {
        if (!app.devDependencies[dep] && dep !== 'esrol') {
          app.devDependencies[dep] = esrol.devDependencies[dep];
        }
      }
    }
    for (let node in app) {
      if (node !== 'scripts') {
        esrol[node] = app[node];
      }
    }
    return esrol;
  }

  _writePackageJson(json, appPath) {
    let file = path.join(appPath, 'package.json');
    return fs.writeFileSync(file, JSON.stringify(json, null, 2));
  }

  _done() {
    console.log('Happy Coding ^_^'.green.bold);
  }

  _updateConfig(json) {
    json.config.esrol.installed = true;
  }
};
