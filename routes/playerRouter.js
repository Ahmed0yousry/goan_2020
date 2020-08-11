var express = require('express');
const isAuth = require('../middleware/is_auth');
const playerController = require('../controllers/playerController');
var router = express.Router();


router.get('/getAllPlayer_Reservations', isAuth, playerController.getAllPlayer_Reservations);
router.get('/searchPlayGrounds/:governate/:price', isAuth, playerController.searchPlayGrounds);

module.exports = router;