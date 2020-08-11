const sequelize = require('./index');
const Sequelize = require('sequelize');

const paymentTransaction = sequelize.define('paymentTransaction', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    amountOfMoney: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        required: true
    }
});

module.exports = paymentTransaction;