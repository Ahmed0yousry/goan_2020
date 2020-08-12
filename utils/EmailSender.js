require('dotenv').config()
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const api_key = process.env.MAILGUN_API_KEY;
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });

module.exports = (user_email, verification_code) => {
    const data = {
        from: 'Goan <goanapplication@gmail.com>',
        to: user_email,
        subject: 'Verification Code',
        html: '<h3>Use that code to verify your account: <h2>' + verification_code + '</h2></h3>'
    };
    mg.messages().send(data, function(error, body) {
        if (error) {
            console.log(error);
        }
        console.log(body);
    });
}