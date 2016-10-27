var fs = require('fs');
var path = require('path');
var config = require('../../../config/config');

function getConfig(req, res) {
  'use strict';

  res.send(config);
}

function getBase(req, res) {
  'use strict';
  var url = path.join(__dirname, '../../../config/base.ce');

  fs.readFile(url, function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(data);
      res.send(data);
    }
  });
}

module.exports = {
  getConfig: getConfig,
  getBase: getBase
};
