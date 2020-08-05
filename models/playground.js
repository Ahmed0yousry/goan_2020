const sequelize = require('../models/index');
const Sequelize = require('sequelize');

const playGround = sequelize.define('playGround', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    playgroundName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    governate: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    pricePerHour: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    rate: {
        type: Sequelize.DataTypes.STRING
    }
});

module.exports = playGround;