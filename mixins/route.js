'use strict';
module.exports = {
  getSingleRecord: function(req, res) {
    res.end(req.record);
  }
};
