'use strict';
let colors = require('colors');
let bluebird = require('bluebird');
let exec = bluebird.promisify(require('child_process').exec);
let PleasantProgress = require('pleasant-progress');
let progress = new PleasantProgress();
let stepString = '.';

module.exports = class Manager {
  constructor(dependencies, appPath) {
    return this._installDependencies(dependencies, appPath);
  }

  _install(dependencies, appPath, name) {
    let module = name + '@' + dependencies[name];
    let installingString = 'Installing ' + module;
    console.log(installingString.blue.bold);
    progress.start('Please wait'.blue.bold, stepString.blue.bold);
    return exec('npm install --prefix ' + appPath + ' ' + module);
  }

  _appDependencies(appPath) {
    console.log('Installing "dependencies" and "devDependencies"'.blue.bold);
    progress.start('Please wait'.blue.bold, stepString.blue.bold);
    return exec('npm --prefix ' + appPath + ' install');
  }

  _onSuccess(message) {
    progress.stop();
    console.log(message.yellow);
  }

  _onFinish() {
    console.log('All modules were installed successfully!'.green.bold);
  }

  _installDependencies(dependencies, appPath) {
    console.log('Installing "esrolDependencies"..'.blue.bold);
    return this._install(dependencies, appPath, 'node-inspector')
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'nodemon');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'chai');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'debug');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'esrol-server-app');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-cli');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-concurrent');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-eslint');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-force-task');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-node-inspector');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'grunt-nodemon');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'mocha');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'sinon');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'pm2');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._install(dependencies, appPath, 'mocha-sinon');
    })
    .then((string) => {
      this._onSuccess(string);
      return this._appDependencies(appPath);
    })
    .then((string) => {
      this._onSuccess(string);
      this._onFinish();
    })
    .catch((e) => {
      let error = e.cause.toString();
      throw new Error('Unable to install npm modules, error: ', error);
    });
  }

};
