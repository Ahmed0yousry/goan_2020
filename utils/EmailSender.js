const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox625c94c041324051bfb2d41949b525f5.mailgun.org';
const api_key = "657b30b6c24354d83f6d949dbb94c2c8-f7d0b107-3017dcde";
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