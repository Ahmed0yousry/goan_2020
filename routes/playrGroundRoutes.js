var express = require('express');

const isAuth = require('../middleware/is_auth');

const playGroundController = require('../controllers/playGroundController');

var router = express.Router();

router.post('/createPlayGround', isAuth, playGroundController.createPlayGround);
router.post('/updatePlayGround/:G_playGroundId', isAuth, playGroundController.updatePlayGround);
router.post('/createField', isAuth, playGroundController.createField);


router.get('/getFields/:G_playGroundId', isAuth, playGroundController.getAllFields);
router.get('/getPlayGrounds', isAuth, playGroundController.getAllPlayGrounds);


module.exports = router;