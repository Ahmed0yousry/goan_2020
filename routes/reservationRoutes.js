var express = require('express');
const { body } = require('express-validator/check');

const playerPaying = require('../middleware/playerPaying');
const ownerReceiving = require('../middleware/ownerReceiving');
const createPaymentTrans = require('../middleware/createPaymentTrans');
const canCancel = require('../middleware/canCancel');

const isAuth = require('../middleware/is_auth');
const reservationController = require('../controllers/reservationController');

var router = express.Router();

router.get('/getAvailableTimes/:FiledId/:Date', isAuth, reservationController.getAvailableTimes);
router.get('/getAllPlayGround_Reservations/:playGroundId', isAuth, reservationController.getAllPlayGround_Reservations);

router.post('/createReservation', isAuth,
    canCancel.call_the_CCancel_api,
    playerPaying,
    reservationController.createReservation,
    createPaymentTrans,
    ownerReceiving
);


module.exports = router;