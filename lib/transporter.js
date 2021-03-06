/**
 * @author Ivaylo Ivanov
 * @private
 * @class Transporter
 * @description Move content recursively from -> to
 * @requires bluebird
 * @requires ncp
 */
'use strict';
const bluebird = require('bluebird');
const cp = bluebird.promisify(require('ncp').ncp);

module.exports = class Transporter {

  /**
   * @private
   * @method constructor
   * @description Move content recursively from -> to. If the content exists,
   * won't replace it
   * @param {string} source - from
   * @param {string} destination - to
   * @throws {error} error - if fails
   */
  constructor(source, destination) {
    return cp(source, destination)
    .catch((error) => {
      /* istanbul ignore next*/
      throw new Error('Unable to move app files and folders, error: ', error);
    });
  }
};
