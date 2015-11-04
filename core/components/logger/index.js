'use strict';
module.exports = {
  init: function(app) {
    return app.core.components.logger.logger.initLogger(app);
  }, 
}; 