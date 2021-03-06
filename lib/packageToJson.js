/**
 * @author Ivaylo Ivanov
 * @private
 * @class PackageToJson
 * @description Read and parse package.json, then return it as object
 * @requires fs
 */
'use strict';
const fs = require('fs');

module.exports = class PackageToJson {

  /**
   * @private
   * @method constructor
   * @description Read and parse package.json, then return it as object
   * @param {string} file - abs path to the file
   * @throws {error} error - if corrupted package.json
   */
  constructor(file) {
    let string = fs.readFileSync(file, {encoding: 'utf8'});
    try {
      return JSON.parse(string);
    } catch (e) {
      /* istanbul ignore next*/
      throw new Error('Corrupted package.json');
    }
  }

};
