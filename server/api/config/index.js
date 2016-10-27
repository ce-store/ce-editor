var express = require('express');
var controller = require('./config.controller');

var router = express.Router();

router.get('/', controller.getConfig);

module.exports = router;
