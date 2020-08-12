const reservation = require('../models/reservation');
const { Op } = require("sequelize");
const field = require('../models/feild');

var prepare_cancellationApi_data = async(req) => {
    const fieldId = req.body.G_FieldId;
    const reservationDate = req.body.G_Date;
    const userId = req.userId;

    var date1 = new Date(reservationDate); // here we will put the date of the reservation 
    var date2 = new Date(); // here we will the current date
    var hours = (Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600));

    // FIRST FEATURE
    hours = Math.floor(hours); // lead_times for karim
    console.log('the difference between 2 dates : ' + hours);
    // 2nd FEATURE
    var numberPC = await reservation.count({
        where: {
            playerId: userId,
            date: {
                [Op.lt]: date2
            },
            status: 'cancelled'
        }
    }).then(numberPC => {
        return numberPC;
    });
    // 3rd FEATURE
    var numberP_Ok = await reservation.count({
        where: {
            playerId: userId,
            date: {
                [Op.lt]: date2
            },
            status: 'OK'
        }
    }).then(numberP_Ok => {
        return numberP_Ok;
    });
    // 4th FEATURE
    var isRepeatedGuest;
    if (numberP_Ok >= 1) {
        isRepeatedGuest = 1;
    } else {
        isRepeatedGuest = 0;
    }

    var returnField = await field.findOne({
            where: {
                id: fieldId
            }
        }).then(field => {
            return field;
        })
        // 5th FEATURE 
    var avgPrice = returnField.pricePerHour;
    // 6th FEATURE
    var fieldType = returnField.fieldType;
    var CANCELLATION_API_DATA = {
        hours: hours,
        numberPC: numberPC,
        numberP_Ok: numberP_Ok,
        isRepeatedGuest: isRepeatedGuest,
        avgPrice: avgPrice,
        fieldType: fieldType
    }
    console.log("this is the API_DATA : " + CANCELLATION_API_DATA.hours + "\n");

    return CANCELLATION_API_DATA;
}

exports.call_the_CCancel_api = (req, res, next) => {
    var API_DATA = prepare_cancellationApi_data(req);
    API_DATA.then(API_DATA => {
        axios = require('axios');
        axios({
            method: 'post',
            url: 'https://goan-ml.herokuapp.com/predictCan/',
            data: {
                'LeadTime': API_DATA.hours,
                'IsRepeatedGuest': API_DATA.isRepeatedGuest,
                'PreviousCancellations': API_DATA.numberPC,
                'PreviousBookingsNotCanceled': API_DATA.numberP_Ok,
                'avgPrice': API_DATA.avgPrice,
                'fieldType': API_DATA.fieldType
            }
        }, {
            headers: { 'content-type': 'application/json' }
        }).then(res => {
            console.log("this is the response.is_canceled : " + res.data.is_canceled + "\n");
            req.is_canceled = res.data.is_canceled;
            next();
        }).catch(err => {
            console.log(err);
        });
    });

}