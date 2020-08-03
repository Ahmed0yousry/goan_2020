const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox3754de669ea94fc8b33051f63d54f419.mailgun.org';
const api_key = "4a553526c14c41229d3b81ddf962edeb-f7d0b107-1311d563";
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