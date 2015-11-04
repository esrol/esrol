'use strict';
module.exports = {
  extends: ['mixins.route'],
  implements: ['routes.interfaces.route'],
  url: '/hello-world',
  protocolType: 'http',
  getMultipleRecords: function(req, res) {
    res.end('hello_world');
  }
};