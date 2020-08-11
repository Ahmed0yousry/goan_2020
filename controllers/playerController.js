const navigation = require('../utils/navigation');
var playGround = require('../models/playground');
const { Op } = require("sequelize");

exports.getPlayerProfile = (req, res, next) => {
    const userId = req.userId;
    const type = req.type;
    var user = navigation(type);
    user.findOne({
            where: {
                id: userId,
                status: "verified"
            },
            attributes: { exclude: ['password', 'status'] }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            res.json({ user: res_user });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getAllPlayer_Reservations = (req, res, next) => {
    const userId = req.userId;
    const type = req.type;
    var user = navigation(type);
    user.findOne({
            where: {
                id: userId
            }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            return res_user.getReservations();
        })
        .then(playerReservationsArray => {
            res.json({ playerReservationsArray: playerReservationsArray });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.searchPlayGrounds = (req, res, next) => {
    var governate = req.params.governate;
    var startingPrice = req.params.price;
    // city = city.toUpperCase();
    playGround.findAll({
            where: {
                status: 'Active',
                [Op.or]: [{
                        governate: {
                            [Op.like]: '%' + governate
                        }
                    }, {
                        governate: {
                            [Op.substring]: governate
                        }
                    }

                ],
                startingpricePerHour: {
                    [Op.lte]: startingPrice
                }
            },
            attributes: ['id', 'playgroundName', 'city', 'governate', 'startingpricePerHour']
        })
        .then(playGrounds => {
            if (!playGrounds.length) {
                const error = new Error('there are no playgrounds open in the chosen city or less than the selected price can be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            res.json({ playGrounds: playGrounds });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}