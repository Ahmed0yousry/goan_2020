const mailgun = require("mailgun-js");
const DOMAIN = 'mail.goanapp.me';
const api_key = "key-351e011fa4698f9474eedd202ddc10ae";
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