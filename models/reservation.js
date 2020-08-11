const sequelize = require('../models/index');
const Sequelize = require('sequelize');

const reservation = sequelize.define('reservation', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
        required: true
    },
    time: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    totalCost: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        required: true
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    canCancel: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        required: true
    }
});

module.exports = reservation;