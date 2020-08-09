const sequelize = require('../models/index');
const Sequelize = require('sequelize');

const field = sequelize.define('field', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    pricePerHour: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        required: true
    },
    fieldWidth: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    fieldLenth: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    fieldType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    }
});

module.exports = field;