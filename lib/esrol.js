/**
 * @author Ivaylo Ivanov
 * @public
 * @class Esrol
 * @description Main Class. Move the server app to the destination folder,
 * update the esrol config in package.json and merge both package.json from
 * destination folder and esrol-server-app
 * @requires fs
 * @requires path
 * @requires ./packageToJson
 * @requires ./transporter
 */
'use strict';
const fs = require('fs');
const path = require('path');
const PackageToJson = require('./packageToJson');
const Transporter = require('./transporter');
const colors = require('colors'); //eslint-disable-line

module.exports = class Esrol {

  /**
   * @private
   * @method constructor
   * @description Initialize Esrol, get package.json as object
   * from destination path and call _createApp
   * @param {string} esrolPath - the abs path to esrol
   * @param {string} cb (optional)- destination path
   */
  constructor(esrolPath, appPath) {
    let modulePath = path.join('node_modules', 'esrol');
    appPath = appPath || esrolPath.replace(modulePath, '');
    let packagePath = path.join(appPath, 'package.json');
    let packageJson = {};
    if (fs.existsSync(packagePath)) {
      packageJson = new PackageToJson(packagePath);
    }
    this._createApp(packageJson, esrolPath, appPath);
  }

  /**
   * @private
   * @method _createApp
   * @description Install app if not installed
   * @param {object} json - from package.json
   * @param {string} esrolPath - the abs path to esrol
   * @param {string} appPath- destination path
   */
  _createApp(json, esrolPath, appPath) {
    if (json.config && json.config.esrol && json.config.esrol.installed) {
      return true;
    }
    return this._fullInstall(json, esrolPath, appPath);
  }

  /**
   * @private
   * @method _createApp
   * @description Install app. Move content from apps/server to appPath
   * @param {object} json - from package.json
   * @param {string} esrolPath - the abs path to esrol
   * @param {string} appPath- destination path
   */
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

  /**
   * @private
   * @method _unlinkFile
   * @description Delete file if exists
   * @param {string} dir - full path to dir
   * @param {string} name - file name
   */
  _unlinkFile(dir, name) {
    let file = path.join(dir, name);
    if (fs.existsSync(file)) {
      fs.unlink(file);
    }
  }

  /**
   * @private
   * @method _mergeBothPackages
   * @description Merge both package.json from the static app and the one from
   * the destination folder
   * @param {object} app - from destination folder
   * @param {object} esrol - from static app (apps/server/esrol-package.json)
   */
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

  /**
   * @private
   * @method _writePackageJson
   * @description Write package.json into destination folder
   * @param {object} json
   * @param {string} appPath
   */
  _writePackageJson(json, appPath) {
    let file = path.join(appPath, 'package.json');
    return fs.writeFileSync(file, JSON.stringify(json, null, 2));
  }

  /**
   * @private
   * @method _done
   * @description Dummy message when everything is done
   */
  _done() {
    console.log('Happy Coding ^_^'.green.bold); //eslint-disable-line
  }

  /**
   * @private
   * @method _updateConfig
   * @description Update config.esrol in package.json when esrol is installed
   * @param {object} json
   */
  _updateConfig(json) {
    json.config.esrol.installed = true;
  }
};
