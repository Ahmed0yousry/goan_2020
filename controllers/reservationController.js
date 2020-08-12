var field = require('../models/feild');
var playground = require('../models/playground');

const getDifference = require('../utils/getDifference');
var navigation = require('../utils/navigation');

function generateListOfAvailableTimes(reservationsArray, opening_hour, closing_hour) {
    var list_of_availableTimes = [];
    var Ftemp_arr = opening_hour.split(':');
    var Ltemp_arr = closing_hour.split(':');

    var opening_minute_int = Ftemp_arr[1];
    var AfterMidNight = false;
    var opening_hour_int = parseInt(Ftemp_arr[0]);
    var closing_hour_int = parseInt(Ltemp_arr[0]);
    if (closing_hour_int < opening_hour_int) {
        AfterMidNight = true;
    }
    var result;
    var counter;
    if (AfterMidNight) {
        for (counter = opening_hour_int; counter <= 24; counter++) {
            list_of_availableTimes.push(counter + ':' + opening_minute_int);
        }
        for (counter = counter - 24; counter < closing_hour_int; counter++) {
            list_of_availableTimes.push(counter + ':' + opening_minute_int);
        }
    } else {
        for (counter = opening_hour_int; counter <= closing_hour_int; counter++) {
            list_of_availableTimes.push(counter + ':' + opening_minute_int);
        }
    }
    if (!reservationsArray.length) {
        result = list_of_availableTimes;
    } else {
        result = getDifference.arr_diff(list_of_availableTimes, reservationsArray);
    }
    return result;
}

exports.getAvailableTimes = (req, res, next) => {
    const fieldId = req.params.FiledId;
    const date = req.params.Date;
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var daynumber = new Date(date).getDay();
    var dayName = days[daynumber];
    var feild;
    var opening_hour;
    var closing_hour;
    field.findOne({
            where: {
                id: fieldId,
            }
        })
        .then(res_field => {
            if (!res_field) {
                const error = new Error('a field with this id cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            feild = res_field;
            // temporary just using the regular password
            return feild.getPlayGround();
        })
        .then(playGround => {
            if (!playGround) {
                const error = new Error('there is no playground with this ID');
                error.statusCode = 401;
                throw error;
            }
            opening_hour = playGround.openingHour;
            closing_hour = playGround.closingHour;
            var list_of_days = playGround.listOfAvailableDays.split(',');
            var is_existed = list_of_days.find(element => element == dayName);
            if (!is_existed) {
                const error = new Error('The chosen day isn\'t available (consider it a day off) for this playground');
                error.statusCode = 401;
                throw error;
            }
            return feild.getReservations({
                attributes: ['time'],
                where: {
                    date: date
                }
            });
        })
        .then(reservationsArray => {
            var result;
            result = generateListOfAvailableTimes(reservationsArray, opening_hour, closing_hour);
            res.json({ list_of_availableTimes: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}



exports.createReservation = (req, res, next) => {
    const fieldId = req.body.G_FieldId;
    const reservationDate = req.body.G_Date;
    const reservationTime = req.body.G_Time;
    const totalCost = req.body.G_TotalCost;

    var is_canceled = req.is_canceled

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
            return res_user.createReservation({
                date: reservationDate,
                time: reservationTime,
                fieldId: fieldId,
                totalCost: totalCost,
                status: 'OK',
                canCancel: is_canceled
            });
        })
        .then(is_created => {
            if (!is_created) {
                const error = new Error('your reservation isn\'t created');
                error.statusCode = 401;
                throw error;
            }
            req.fieldId = fieldId;
            // here we need to pass the flow to payment middleware
            next();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getAllPlayGround_Reservations = (req, res, next) => {
    const playGroundId = req.params.playGroundId;
    playground.findOne({
            where: {
                id: playGroundId
            }
        })
        .then(playground => {
            if (!playground) {
                const error = new Error('a playground with this id cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            return playground.getFields();
        })
        .then(async fieldsArray => {
            if (!fieldsArray.length) {
                const error = new Error('there are no fields created for this playground');
                error.statusCode = 401;
                throw error;
            }
            var tempArrayOfReservations = [];
            var totalArrayOfReservations = [];
            for (var i = 0; i < fieldsArray.length; i++) {
                tempArrayOfReservations = await fieldsArray[i].getReservations().then(reservationArray => {
                    return reservationArray;
                });
                totalArrayOfReservations = totalArrayOfReservations.concat(tempArrayOfReservations);
            }
            if (!totalArrayOfReservations.length) {
                const error = new Error('there are no reservations created for this playground');
                error.statusCode = 401;
                throw error;
            } else
                res.json({ totalArrayOfReservations: totalArrayOfReservations });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}