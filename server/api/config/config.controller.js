var config = require('../../../config/config');

function getConfig(req, res) {
  'use strict';

  res.send(config);
}

module.exports = {
  getConfig: getConfig
};
