var navigation = require('../utils/navigation');

exports.createPlayGround = (req, res, next) => {
    const playGroundName = req.body.G_PlaygroundName;
    const playGroundGovernate = req.body.G_Governate;
    const playGroundCity = req.body.G_City;
    const pricePerHour = req.body.G_PricePerHour;
    const active = req.body.G_Status;

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
            return res_user.createPlayGround({
                playgroundName: playGroundName,
                governate: playGroundGovernate,
                city: playGroundCity,
                pricePerHour: pricePerHour,
                status: active
            });
        })
        .then(is_created => {
            if (!is_created) {
                const error = new Error('Wrong playGround data');
                error.statusCode = 401;
                throw error;
            }
            res.json({ message: 'your playground has been added successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}