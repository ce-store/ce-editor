var express = require('express');
var controller = require('./config.controller');

var router = express.Router();

router.get('/', controller.getConfig);
router.get('/base', controller.getBase);
router.get('/tutorial', controller.getTutorial);

module.exports = router;