var navigation = require('../utils/navigation');

module.exports = (req, res, next) => {
    var charge = req.body.G_TotalCost;
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
            return res_user.getPlayerWallet();
        })
        .then(wallet => {
            if (!wallet) {
                const error = new Error('there are no wallet created for this user');
                error.statusCode = 401;
                throw error;
            }
            if (charge > wallet.balanceAmount) {
                const error = new Error('this reservation cannot be made because of low account balance');
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
            next(err);
        });
}