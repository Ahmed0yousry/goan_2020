const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var phoneToken = require('generate-sms-verification-code');
const { validationResult } = require('express-validator/check');

var playground = require('../models/playground');;
var navigation = require('../utils/navigation');
var emailSender = require('../utils/EmailSender');


// sign Up API
exports.SignUP = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    var generatedToken = phoneToken(6, { type: 'number' }).toString();
    const email = req.body.G_Email;
    const password = req.body.G_Password;
    const Fname = req.body.G_Fname;
    const Lname = req.body.G_Lname;
    const type = req.body.G_Type;
    var user = navigation(type);
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            return user.create({
                email: email,
                password: hashedPw,
                Fname: Fname,
                Lname: Lname,
                status: generatedToken
            });
        })
        .then(result => {
            emailSender(email, generatedToken);
            res.status(201).json({ message: 'please check your email to verify your account', userId: result.id, type: type });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


// verifing signed up users
exports.verifySignUP = (req, res, next) => {
    const userId = parseInt(req.body.G_userId);
    const verification_Code = req.body.G_V_code;
    const type = req.body.G_Type;
    var user = navigation(type);
    user.findOne({
            where: {
                id: userId,
                status: verification_Code
            }
        })
        .then(user => {
            if (!user) {
                const error = new Error('you entered a non valid code');
                error.statusCode = 401;
                throw error;
            }
            // temporary just using the regular password
            user.status = "verified";
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'account verified successfully you can log in now' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


// log in API
exports.userLogIN = (req, res, next) => {
    const email = req.body.G_Email;
    const password = req.body.G_Password;
    const type = req.body.G_Type;
    var user = navigation(type);
    var userId;
    user.findOne({
            where: {
                email: email,
                status: "verified"
            }
        })
        .then(res_user => {
            if (!res_user) {
                const error = new Error('a user with this email cann\'t be found');
                error.statusCode = 401;
                throw error;
            }
            userId = res_user.id;
            // temporary just using the regular password
            return bcrypt.compare(password, res_user.password);
        })
        .then(is_equal => {
            if (!is_equal) {
                const error = new Error('wrong password');
                error.statusCode = 401;
                throw error;
            }
            const Token = jwt.sign({ email: email, userId: userId, type: type },
                'anaAHMEDyousry1998', { expiresIn: '2h' });
            res.status(200).json({ token: Token, type: type });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}