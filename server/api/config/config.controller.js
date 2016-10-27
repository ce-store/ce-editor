var fs = require('fs');
var path = require('path');
var config = require('../../../config/config');

function getConfig(req, res) {
  'use strict';

  res.send(config);
}

function getBase(req, res) {
  'use strict';
  var url = path.join(__dirname, '../../../tutorial/base.ce');

  fs.readFile(url, function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
}

function getTutorial(req, res) {
  'use strict';
  var url = path.join(__dirname, '../../../tutorial/one.ce');

  fs.readFile(url, function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
}

module.exports = {
  getConfig: getConfig,
  getBase: getBase,
  getTutorial: getTutorial
};
