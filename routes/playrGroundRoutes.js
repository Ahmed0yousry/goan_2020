var express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middleware/is_auth');

const playGroundController = require('../controllers/playGroundController');

var router = express.Router();

router.post('/createPlayGround', isAuth, playGroundController.createPlayGround);

module.exports = router;