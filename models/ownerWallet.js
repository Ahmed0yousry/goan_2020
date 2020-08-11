const sequelize = require('../models/index');
const Sequelize = require('sequelize');

const ownerWallet = sequelize.define('ownerWallet', {
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

module.exports = ownerWallet;