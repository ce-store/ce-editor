var express = require('express');
var controller = require('./ce.controller');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', controller.getCe);
router.get('/things', controller.getThings);
router.get('/concepts', controller.getConcepts);
router.post('/validate', controller.validate);
router.post('/', controller.saveCe);

module.exports = router;
