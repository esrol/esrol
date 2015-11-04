'use strict';
module.exports = {
  extends: ['vendors.fs', 'core.components.logger.logger'],
  init: function() {
    this.debug('mysql adapter running');
  }
};
