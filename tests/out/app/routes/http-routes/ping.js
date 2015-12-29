'use strict';

module.exports = class Ping {

  static get url() {
    return '/ping';
  }

  static getMultipleRecords(req, res) {
    return res.end('pong');
  }

  static getSingleRecord(req, res) {
    return res.end(req.record);
  }

};
