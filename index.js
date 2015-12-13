'use strict';
let Esrol = require('./lib/esrol');
let path = require('path');
let tests = process.argv[2] === '--tests'
let absPath = process.argv[1];
let modulePath = tests ? path.join('tests', 'out') : null;
new Esrol(absPath, modulePath);
