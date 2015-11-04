'use strict';
module.exports = {
  extends: ['core.components.logger.logger'],
  priority: 1,
  init: function() {
    return this.callback;
  }, 
  callback: function(req, res, next) {
    this.debug('http middleware running');
    next();
  }, 
}; 