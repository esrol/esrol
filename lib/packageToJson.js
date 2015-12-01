'use strict';
let fs = require ('fs');

module.exports = class PackageToJson {

  constructor(file) {
    let string = fs.readFileSync(file, {encoding: 'utf8'});
    try {
      return JSON.parse(string);
    } catch(e) {
      throw new Error('Corrupted package.json');
    }
  }

};
