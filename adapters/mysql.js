'use strict';
module.exports = {
  extends: ['vendors.fs', 'core.logger'],
  init: function() {
    this.debug('mysql adapter running');
  }
};
