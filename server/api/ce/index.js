var express = require('express');
var controller = require('./ce.controller');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', controller.getCe);
router.get('/things', controller.getThings);
router.get('/concepts', controller.getConcepts);
router.get('/concept/:name', controller.getConcept);
router.get('/rules', controller.getRules);
router.get('/instance/:name', controller.getInstance);

router.post('/validate', controller.validate);
router.post('/', controller.saveCe);

module.exports = router;
