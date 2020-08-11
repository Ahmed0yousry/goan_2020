const sequelize = require('../models/index');
const Sequelize = require('sequelize');

const playerWallet = sequelize.define('playerWallet', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    balanceAmount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        required: true
    }
});

module.exports = playerWallet;