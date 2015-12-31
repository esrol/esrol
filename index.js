'use strict';
let Esrol = require('./lib/esrol');
let path = require('path');
let tests = process.argv[2] === '--tests';
let modulePath = tests ? path.join(__dirname, 'tests', 'out') : null;
// because of broken travis build
if (process.argv[1] !== '/home/travis/build/esrol/esrol/index.js') {
  new Esrol(__dirname, modulePath);
}
