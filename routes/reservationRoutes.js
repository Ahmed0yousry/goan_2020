var express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middleware/is_auth');

const reservationController = require('../controllers/reservationController');

var router = express.Router();

router.get('/getAvailableTimes/:FiledId/:Date', isAuth, reservationController.getAvailableTimes);
router.get('/getAllPlayGround_Reservations/:playGroundId', isAuth, reservationController.getAllPlayGround_Reservations);

router.post('/createReservaion', isAuth, reservationController.createReservaion);


module.exports = router;