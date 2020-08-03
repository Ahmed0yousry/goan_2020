var express = require('express');
const { body } = require('express-validator/check');

const user = require('../models/user');
const userController = require('../controllers/userController');

var router = express.Router();

/* GET users listing. */
router.post('/logIn', userController.userLogIN);

router.post('/signUp', [
    body('G_Email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return user.findOne({ where: { email: value } }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
    .normalizeEmail(),
    body('G_Password')
    .trim()
    .isLength({ min: 5 })
    .custom((value, { req }) => {
        let isEqual = (value == req.body.G_confirmPassword);
        if (!isEqual) {
            return Promise.reject('password and its confirmation don\'t match!');
        }
        return true;
    }),
    body('G_Fname')
    .trim()
    .not()
    .isEmpty(),
    body('G_Lname')
    .trim()
    .not()
    .isEmpty()
], userController.SignUP);

router.post('/verifySignUP', userController.verifySignUP);

module.exports = router;