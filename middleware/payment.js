var navigation = require('../utils/navigation');

exports.modifyWalletForPlayer = (req, res, next) => {
    var charge = req.body.G_TotalCost;
    const userId = req.userId;
    const type = req.type;
    var user = navigation(type);
    user.findOne({
            where: {
                id: userId,
                status: "verified"
            }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            return res_user.getPlayerWallet();
        })
        .then(wallet => {
            if (!wallet) {
                const error = new Error('there are no wallet created for this user');
                error.statusCode = 401;
                throw error;
            }
            if (charge > wallet.balanceAmount) {
                const error = new Error('this reservation cannot be made because of low account balance');
                error.statusCode = 401;
                throw error;
            }
            wallet.balanceAmount = wallet.balanceAmount - charge;
            return wallet.save();

        })
        .then(result => {
            next();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.p3 = (req, res, next) => {
    var charge = req.body.G_TotalCost;
    const userId = req.playgroundOwnerId;
    const type = "playground owner";
    var user = navigation(type);
    user.findOne({
            where: {
                id: userId,
                status: "verified"
            }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            return res_user.getOwnerWallet();
        })
        .then(wallet => {
            if (!wallet) {
                const error = new Error('there are no wallet created for this user');
                error.statusCode = 401;
                throw error;
            }
            wallet.balanceAmount = wallet.balanceAmount + charge;
            return wallet.save();
        })
        .then(result => {
            // here we will put the response to be sent 
            res.json({ message: 'your reservation has been mede successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


var field = require('../models/feild');
exports.modifyWalletForPlayGroundOwner = async(req, res, next) => {
    var charge = req.body.G_TotalCost;
    var fieldId = req.fieldId;
    var playgroundOwnerId;

    const userId = req.userId;
    const type = req.type;
    var user = navigation(type);
    playgroundOwnerId = await field.findOne({
            where: {
                id: fieldId
            }
        })
        .then(field => {
            if (!field) {
                const error = new Error('a field with this id cannot be found');
                error.statusCode = 401;
                throw error;
            }
            return field.getPlayGround();
        })
        .then(playground => {
            if (!playground) {
                const error = new Error('a playground with this id cannot be found');
                error.statusCode = 401;
                throw error;
            }
            return playground.getPlayGroundOwner();
        })
        .then(async playgroundOwner => {
            playgroundOwnerId = playgroundOwner.id;
            return playgroundOwnerId;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });


    user.findOne({
            where: {
                id: userId,
                status: "verified"
            }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            return res_user.createPaymentTransaction({
                amountOfMoney: charge,
                playGroundOwnerId: playgroundOwnerId
            });
        })
        .then(paymentTransaction => {
            if (!paymentTransaction) {
                const error = new Error('there are no payment transaction created for this charge');
                error.statusCode = 401;
                throw error;
            }
            req.playgroundOwnerId = playgroundOwnerId;
            next();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}