var field = require('../models/feild');
var navigation = require('../utils/navigation');

exports.cancelReservation = (req, res, next) => {
    var reservation_id = req.body.G_ReservationId;
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
            return res_user.getReservations({
                where: {
                    id: reservation_id,
                    status: "OK",
                    canCancel: 1
                }
            }).then(reservations => {
                if (!reservations.length) {
                    const error = new Error('there are no reservations for this user be found');
                    error.statusCode = 401;
                    throw error;
                }
                var reservation = reservations[0];
                var date1 = new Date(reservation.createdAt); // here we will put the date of the reservation 
                var date2 = new Date(reservation.date); // here we will the current date
                var hours = (Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600));
                hours = Math.floor(hours);

                var returned_money = calculate_the_returned_amount(hours, reservation.totalCost);

                req.returned_money = returned_money;
                req.fieldId = reservation.fieldId;

                reservation.status = "cancelled";
                return reservation.save();
            }).then(isSaved => {
                if (!isSaved) {
                    const error = new Error('your reservation wasn\'t cancelled');
                    error.statusCode = 401;
                    throw error;
                }
                next();
            });
        })
}

var calculate_the_returned_amount = (hours, totalCost) => {
    var result;
    if (hours > 72) {
        result = totalCost * 0.95;
    } else if (hours > 48) {
        result = totalCost * 0.85;
    } else if (hours > 24) {
        result = totalCost * 0.75;
    } else if (hours < 24) {
        result = totalCost * 0.50;
    }
    return result
}

// var getOwnerId = async(fieldId) => {
exports.getOwnerId = (req, res, next) => {
    var fieldId = req.fieldId;
    field.findOne({
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
        .then(playgroundOwner => {
            req.playgroundOwnerId = playgroundOwner.id;
            next();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log(err);
        });
}

// var updateOwnerWallet = async(charge, userId) => {
exports.updateOwnerWallet = (req, res, next) => {
    const userId = req.playgroundOwnerId;
    var charge = req.returned_money;
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
            console.log(err);
        });
}

// var updatePlayerWallet = async(charge, userId) => {
exports.updatePlayerWallet = (req, res, next) => {
    const userId = req.userId;
    var charge = req.returned_money;
    const type = "player";
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
            wallet.balanceAmount = wallet.balanceAmount + charge;
            return wallet.save();
        })
        .then(result => {
            res.json({ message: 'your reservation has been cancelled successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log(err);
        });
}