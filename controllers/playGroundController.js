var navigation = require('../utils/navigation');

exports.createPlayGround = (req, res, next) => {
    const playGroundName = req.body.G_PlaygroundName;
    const playGroundGovernate = req.body.G_Governate;
    const playGroundCity = req.body.G_City;
    const pricePerHour = req.body.G_PricePerHour;
    const active = req.body.G_Status;
    const openingHour = req.body.G_OpeningHour;
    const closingHour = req.body.G_ClosingHour;
    const listOfAvailableDays = req.body.G_ListOfAvailableDays;


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
                status: active,
                openingHour: openingHour,
                closingHour: closingHour,
                listOfAvailableDays: listOfAvailableDays
            });
        })
        .then(is_created => {
            if (!is_created) {
                const error = new Error('Wrong playGround data');
                error.statusCode = 401;
                throw error;
            }
            res.json({ message: 'your playground has been added successfully', id: is_created.id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updatePlayGround = (req, res, next) => {
    var playGroundName = req.body.G_PlaygroundName;
    var playGroundGovernate = req.body.G_Governate;
    var playGroundCity = req.body.G_City;
    var pricePerHour = req.body.G_PricePerHour;
    var active = req.body.G_Status;
    var openingHour = req.body.G_OpeningHour;
    var closingHour = req.body.G_ClosingHour;
    var listOfAvailableDays = req.body.G_ListOfAvailableDays;

    const playGroundId = req.params.G_playGroundId;

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
            return res_user.getPlayGrounds({
                where: {
                    id: playGroundId
                }
            });
        })
        .then(playgrounds => {
            if (!playgrounds.length) {
                const error = new Error('there is no playground with this id');
                error.statusCode = 401;
                throw error;
            }
            var playground = playgrounds[0];
            playground.playgroundName = playGroundName;
            playground.governate = playGroundGovernate;
            playground.city = playGroundCity;
            playground.pricePerHour = pricePerHour;
            playground.status = active;
            playground.openingHour = openingHour;
            playground.closingHour = closingHour;
            playground.listOfAvailableDays = listOfAvailableDays;
            playground.save();
            res.json({ message: 'your playground has been updated successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
exports.createField = (req, res, next) => {
    const FieldType = req.body.G_FieldType;
    const FieldWidth = req.body.G_FieldWidth;
    const FieldLength = req.body.G_FieldLength;
    const playGroundId = parseInt(req.body.G_playGroundId);

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
            return res_user.getPlayGrounds({
                where: {
                    id: playGroundId
                }
            });
        })
        .then(playGround => {
            if (!playGround) {
                const error = new Error('there is no playground with this ID');
                error.statusCode = 401;
                throw error;
            }
            // because it returns A list and given the id is a primary key so what we need is 
            // essentially at the only first index
            playGround = playGround[0];
            return playGround.createField({
                fieldWidth: FieldWidth,
                fieldLenth: FieldLength,
                fieldType: FieldType
            });
        })
        .then(is_created => {
            if (!is_created) {
                const error = new Error('Wrong field data');
                error.statusCode = 401;
                throw error;
            }
            res.json({ message: 'your field has been added successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.getAllFields = (req, res, next) => {
    const playGroundId = req.params.G_playGroundId;

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
            return res_user.getPlayGrounds({
                where: {
                    id: playGroundId
                }
            });
        })
        .then(playGround => {
            if (!playGround) {
                const error = new Error('there is no playground with this ID');
                error.statusCode = 401;
                throw error;
            }
            // because it returns A list and given the id is a primary key so what we need is 
            // essentially at the only first index
            playGround = playGround[0];
            return playGround.getFields();
        })
        .then(fields_array => {
            if (!fields_array.length) {
                const error = new Error('there are no field within this playground');
                error.statusCode = 401;
                throw error;
            }
            res.json({ fields: fields_array });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getAllPlayGrounds = (req, res, next) => {
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
            return res_user.getPlayGrounds();
        })
        .then(playGrounds_array => {
            if (!playGrounds_array.length) {
                const error = new Error('there is no playgrounds for this owner');
                error.statusCode = 401;
                throw error;
            }
            res.json({ playGrounds: playGrounds_array });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}