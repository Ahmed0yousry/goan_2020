var express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middleware/is_auth');

const playGroundController = require('../controllers/playGroundController');

var router = express.Router();

router.post('/createPlayGround', isAuth, playGroundController.createPlayGround);
router.post('/createField', isAuth, playGroundController.createField);

router.post('/getFields', isAuth, playGroundController.getAllFields);


module.exports = router;