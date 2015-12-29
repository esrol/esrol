'use strict';
let Esrol = require('./lib/esrol');
let path = require('path');
let tests = process.argv[2] === '--tests';
let modulePath = tests ? path.join(__dirname, 'tests', 'out') : null;
new Esrol(__dirname, modulePath);
