'use strict';
module.exports = {
  url: 'fourOhFour',
  all: function(req, res) {
    res.statusCode = 404;
    res.end();
  }
}