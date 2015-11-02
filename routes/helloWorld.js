'use strict';
module.exports = {
  extends: ['mixins.route'],
  implements: ['routes.interfaces.route'],
  url: '/hello-world',
  type: 'http',
  getMultipleRecords: function(req, res) {
    res.end('hello_world');
  }
};