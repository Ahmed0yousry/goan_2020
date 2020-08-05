const player = require('../models/player');
const playGroundOwner = require('../models/playGroundOwner');

module.exports = (type) => {
    var user;
    if (type == "player") {
        user = player;
    } else {
        user = playGroundOwner;
    }
    return user;
}