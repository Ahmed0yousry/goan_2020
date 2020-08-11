var express = require('express');

const isAuth = require('../middleware/is_auth');

const cancelController = require('../controllers/cancelController');

var router = express.Router();
router.post('/cancelReservation',
    isAuth,
    cancelController.cancelReservation,
    cancelController.getOwnerId,
    cancelController.updateOwnerWallet,
    cancelController.updatePlayerWallet
);

module.exports = router;