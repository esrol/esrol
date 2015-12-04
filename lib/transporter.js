'use strict';
let bluebird = require('bluebird');
let cp = bluebird.promisify(require('ncp').ncp);

module.exports = class Transporter {

  constructor(source, destination) {
    return cp(source, destination)
    .catch((error) => {
      throw new Error('Unable to move app files and folders, error: ', error);
    });
  }
};
